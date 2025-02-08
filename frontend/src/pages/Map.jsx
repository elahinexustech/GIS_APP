import React, { useContext, useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RegionContext } from "../components/RegionContext";
import { FaThumbsUp, FaThumbsDown, FaComment, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { MapDashboard } from "./MapDashboard";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import axios from 'axios';

mapboxgl.accessToken = "pk.eyJ1IjoibWVycmlsIiwiYSI6ImNscTZ0dHBwcjB3cGUyam14eWlxM3Q1aWgifQ.WxB3FepLWrhZ4kqtL2F5Iw";

import { BASE_URL } from '../../_CONST_';
import { AuthContext } from "../components/AuthContext";



const Map = () => {
    const { setSelectedRegion } = useContext(RegionContext);
    const { userId } = useContext(AuthContext);
    const [markers, setMarkers] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [selectedMarkerId, setSelectedMarkerId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState([]);
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const boundarySourceRef = useRef(null);
    const drawRef = useRef(null);
    const [sameUser, setSameUser] = useState(false);
    const [isRegionProvided, setIsRegionProvided] = useState(false);
    const [polygonCoordinates, setPolygonCoordinates] = useState([]);
    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedMarkerType, setSelectedMarkerType] = useState(null);

    useEffect(() => {
        fetchProjects();

        const region = localStorage.getItem('region');
        if (region) {
            try {
                const coordinates = region.split('/')[0].split(',').map(coord => coord.split('_').map(Number));
                setIsRegionProvided(true);
                setPolygonCoordinates([coordinates]);
            } catch (error) {
                console.error("Error parsing region from localStorage:", error);
                setIsRegionProvided(false);
            }
        } else {
            setIsRegionProvided(false);
        }

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [-87.63236, 41.881954],
            zoom: 9,
        });

        if (!isRegionProvided) {
            drawRef.current = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true,
                },
                defaultMode: "draw_polygon",
            });

            mapRef.current.addControl(drawRef.current, "top-left");

            mapRef.current.on("draw.create", handleDrawCreate);
            mapRef.current.on("draw.delete", handleDrawDelete);
            mapRef.current.on("draw.update", handleDrawUpdate);
        } else {
            if (polygonCoordinates.length > 0) {
                setBoundaryFromPolygon([polygonCoordinates]);
                const center = getPolygonCenter(polygonCoordinates);
                mapRef.current.flyTo({ center, zoom: 16 });
            } else {
                mapRef.current.flyTo({ center: [-87.63236, 41.881954], zoom: 16 });
            }
        }

        mapRef.current.on("load", () => {
            mapRef.current.addSource("boundary", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [],
                },
            });

            boundarySourceRef.current = mapRef.current.getSource("boundary");

            mapRef.current.addLayer({
                id: "highlight-layer",
                type: "fill",
                source: "boundary",
                filter: ["==", "$type", "Polygon"],
            });

            mapRef.current.addLayer({
                id: "dotted-boundary",
                type: "line",
                source: "boundary",
                paint: {
                    "line-color": "#FF0000",
                    "line-width": 2,
                    "line-dasharray": [4, 2],
                },
                filter: ["==", "$type", "Polygon"],
            });

            if (isRegionProvided) {
                fetchMarkers();

                mapRef.current.addLayer({
                    id: "black-overlay",
                    type: "fill",
                    source: {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            features: [{
                                type: "Feature",
                                geometry: {
                                    type: "Polygon",
                                    coordinates: [[
                                        [-180, -90],
                                        [180, -90],
                                        [180, 90],
                                        [-180, 90],
                                        [-180, -90]
                                    ]]
                                }
                            }]
                        }
                    },
                    paint: {
                        "fill-color": "black",
                        "fill-opacity": 0.5
                    }
                });

                mapRef.current.addLayer({
                    id: "polygon-mask",
                    type: "fill",
                    source: {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            features: [{
                                type: "Feature",
                                geometry: {
                                    type: "Polygon",
                                    coordinates: polygonCoordinates
                                }
                            }]
                        }
                    },
                    paint: {
                        "fill-color": "white",
                        "fill-opacity": 0.5
                    }
                });
            }
        });

        mapRef.current.on("click", (e) => {
            if (isRegionProvided) {
                const { lngLat } = e;
                if (!selectedIcon) {
                    setShowToolbar(true);
                    return;
                }
                if (isPointInPolygon(lngLat, polygonCoordinates[0])) {
                    addMarkersAtLocation(lngLat, selectedMarkerId);
                    setShowToolbar(true);
                } else {
                    toast.error("You can only add markers inside the polygon.");
                }
            }
        });


        const nav = new mapboxgl.NavigationControl();
        mapRef.current.addControl(nav, 'top-right');

        return () => mapRef.current?.remove();
    }, [selectedIcon, isRegionProvided]);

    const getPolygonCenter = (coordinates) => {
        if (!coordinates || !coordinates[0] || coordinates[0].length < 1) {
            console.error("Invalid or empty coordinates array:", coordinates);
            return null;
        }

        const firstCoord = coordinates[0][0];
        if (!Array.isArray(firstCoord) || firstCoord.length !== 2) {
            console.error("Invalid first coordinate:", firstCoord);
            return null;
        }

        try {
            const bounds = coordinates[0].reduce((bounds, coord) => {
                if (!Array.isArray(coord) || coord.length !== 2) {
                    console.error("Invalid coordinate pair:", coord);
                    return bounds;
                }
                return bounds.extend([coord[0], coord[1]]);
            }, new mapboxgl.LngLatBounds([firstCoord[0], firstCoord[1]], [firstCoord[0], firstCoord[1]]));

            return bounds.getCenter();
        } catch (e) {
            console.error("Error computing center:", e);
            return null;
        }
    };

    const isPointInPolygon = (point, polygon) => {
        const x = point.lng, y = point.lat;
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    const handleDrawCreate = (e) => {
        const { features } = e;
        if (features && features[0].geometry.type === "Polygon") {
            const coordinates = features[0].geometry.coordinates;
            setPolygonCoordinates(coordinates);
        }
    };

    const handleDrawDelete = () => {
        setPolygonCoordinates([]);
    };

    const handleDrawUpdate = (e) => {
        const { features } = e;
        if (features && features[0].geometry.type === "Polygon") {
            const coordinates = features[0].geometry.coordinates;
            setPolygonCoordinates(coordinates);
        }
    };

    const saveRegion = () => {
        if (polygonCoordinates.length > 0) {
            setSelectedRegion(polygonCoordinates);
            localStorage.setItem('coordinates', JSON.stringify(polygonCoordinates));
            toast.success("Region saved successfully.");
        } else {
            console.warn("No polygon to save.");
        }
    };

    const fetchMarkers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/markers/`, { withCredentials: true });
            const data = response.data;

            data.forEach((marker) => {
                createCustomMarkers(
                    { lng: marker.longitude, lat: marker.latitude },
                    marker.icon_type,
                    marker.id,
                    marker.user_id,
                    marker.interaction_count
                );

                setMarkers((prevMarkers) => [...prevMarkers, marker]);


            });
        } catch (error) {
            console.error("Error fetching markers:", error);
        }
    };

    const createCustomMarkers = (
        lngLat,
        iconType,
        markerId,
        userId,
        interactionCount
    ) => {
        const [lon, lat] = [lngLat.lng, lngLat.lat];
        let iconHtml;

        if ((iconType === "like" || iconType === "dislike") && !interactionCount) {
            interactionCount = 1;
        } else if (iconType === "comment" && !interactionCount) {
            interactionCount = 0;
        }

        const baseDropStyle = `
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
          border-radius: 50%;
          cursor: pointer;
        `;

        const tailStyle = `
          position: absolute;
          width: 0;
          height: 0;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 15px solid;
        `;

        const commentBubbleStyle = `
          position: relative;
          width: 45px;
          height: 35px;
          background-color: #007bff;
          border-radius: 15px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `;

        const commentTailStyle = `
          position: absolute;
          width: 0;
          height: 0;
          bottom: -10px;
          left: 12px;
          border-left: 10px solid #007bff;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
        `;

        const interactionBadgeStyle = `
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #ff6f61;
          color: white;
          border-radius: 50%;
          padding: 5px 8px;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
          border: 2px solid white;
          z-index: 10;
        `;

        switch (iconType) {
            case "like":
                iconHtml = `
                    <div style="${baseDropStyle} background-color: #28a745;" data-type="like">
                        <span style="color: white; font-size: 20px;">&#128077;</span>
                        <div style="${tailStyle} border-top-color: #28a745;"></div>
                    </div>`;
                break;
            case "dislike":
                iconHtml = `
                    <div style="${baseDropStyle} background-color: #dc3545;" data-type="dislike">
                        <span style="color: white; font-size: 20px;">&#128078;</span>
                        <div style="${tailStyle} border-top-color: #dc3545;"></div>
                    </div>`;
                break;
            case "comment":
                iconHtml = `
                    <div style="${commentBubbleStyle}" data-type="comment">
                        <span style="color: white; font-size: 18px;">&#128172;</span>
                        <div style="${commentTailStyle}"></div>
                    </div>`;
                break;
            default:
                return;
        }

        const markerDiv = document.createElement("div");
        markerDiv.className = "custom-marker";
        markerDiv.innerHTML = iconHtml;

        const interactionBadge = document.createElement("div");
        interactionBadge.style = interactionBadgeStyle;
        interactionBadge.innerText = interactionCount;

        markerDiv.appendChild(interactionBadge);

        const marker = new mapboxgl.Marker(markerDiv)
            .setLngLat([lon, lat])
            .addTo(mapRef.current);

        marker.getElement().dataset.markerId = markerId;
        marker.getElement().dataset.userId = userId;

        marker.getElement().addEventListener("click", () => {
            handleMarkerClick(markerId, marker.getElement().children[0].getAttribute('data-type'));
            if (iconType === "comment") {
                const commentSection = document.getElementById(`comment-section-${markerId}`);
                if (commentSection) {
                    commentSection.remove();
                } else {
                    displayCommentSection(markerId);
                }
            } else {
                const commentSections = document.querySelectorAll(".comment-section");
                commentSections.forEach(section => section.remove());
                fetchMarkerDetails(markerId);
            }
        });
    };

    const displayCommentSection = (markerId) => {
        const previousCommentSection = document.querySelectorAll(".comment-section");
        if (previousCommentSection.length > 0) {
            previousCommentSection.forEach((section) => section.remove());
        }

        let commentSection = document.getElementById(`comment-section-${markerId}`);
        if (!commentSection) {
            commentSection = document.createElement("div");
            commentSection.id = `comment-section-${markerId}`;
            commentSection.className = "comment-section";
            commentSection.style.position = "absolute";
            commentSection.style.backgroundColor = "#f9f9f9";
            commentSection.style.border = "1px solid #e1e1e1";
            commentSection.style.borderRadius = "8px";
            commentSection.style.padding = "15px";
            commentSection.style.width = "350px";
            commentSection.style.height = "300px";
            commentSection.style.overflowY = "auto";
            commentSection.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.1)";
            commentSection.style.zIndex = "100";
            document.body.appendChild(commentSection);
        }

        commentSection.innerHTML = "";

        const inputBox = document.createElement("textarea");
        inputBox.placeholder = "Enter your comment...";
        inputBox.style.width = "100%";
        inputBox.style.padding = "10px";
        inputBox.style.marginBottom = "10px";
        inputBox.style.marginTop = "10px";
        inputBox.style.border = "1px solid #ddd";
        inputBox.style.borderRadius = "5px";
        inputBox.style.fontSize = "14px";
        inputBox.style.boxSizing = "border-box";
        commentSection.appendChild(inputBox);

        const closeButton = document.createElement("button");
        closeButton.innerHTML = "<i class='bi bi-x-circle'></i>";
        closeButton.style.position = "absolute";
        closeButton.style.top = "1px";
        closeButton.style.right = "1px";
        closeButton.style.backgroundColor = "transparent";
        closeButton.style.border = "none";
        closeButton.style.fontSize = "16px";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = () => {
            commentSection.remove();
        };
        commentSection.appendChild(closeButton);

        const submitBtn = document.createElement("button");
        submitBtn.innerText = "Submit";
        submitBtn.style.padding = "8px 15px";
        submitBtn.style.backgroundColor = "#007bff";
        submitBtn.style.color = "white";
        submitBtn.style.border = "none";
        submitBtn.style.borderRadius = "5px";
        submitBtn.style.cursor = "pointer";
        submitBtn.style.fontSize = "14px";
        submitBtn.onclick = () => {
            const commentText = inputBox.value.trim();
            if (commentText) {
                saveComment(markerId, commentText);
                inputBox.value = "";
            }
        };
        commentSection.appendChild(submitBtn);

        fetchComments(markerId).then((comments) => {
            const commentsList = document.createElement("div");
            commentsList.style.marginTop = "15px";

            comments.forEach((comment) => {
                const commentItem = createCommentElement(comment, markerId);
                commentsList.appendChild(commentItem);
            });

            commentSection.appendChild(commentsList);
        });

        const markerElement = document.querySelector(
            `[data-marker-id="${markerId}"]`
        );
        if (markerElement) {
            const { top, left, height } = markerElement.getBoundingClientRect();
            commentSection.style.top = `${top + height}px`;
            commentSection.style.left = `${left}px`;
        }
    };

    const createCommentElement = (comment, markerId) => {
        const commentDiv = document.createElement("div");
        commentDiv.style.backgroundColor = "white";
        commentDiv.style.border = "1px solid #e1e1e1";
        commentDiv.style.borderRadius = "8px";
        commentDiv.style.padding = "10px";
        commentDiv.style.marginBottom = "10px";
        commentDiv.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.1)";

        commentDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong style="font-weight: bold;">${comment.user.full_name}</strong>
                <span style="font-size: 12px; color: #999;">${new Date(
            comment.created_at
        ).toLocaleDateString()}</span>
            </div>
            <p style="margin-bottom: 8px;">${comment.text}</p>
            <button style="background: none; border: none; color: #007bff; cursor: pointer; padding: 0; font-size: 14px;">Reply</button>
        `;

        const replyForm = document.createElement("form");
        replyForm.style.marginTop = "10px";
        replyForm.style.display = "none";
        replyForm.innerHTML = `
    <textarea name="reply" placeholder="Enter your reply..." style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; box-sizing: border-box;"></textarea>
    <button type="submit" style="padding: 8px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">Post Reply</button>
  `;

        const replyBtn = commentDiv.querySelector("button");
        replyBtn.addEventListener("click", () => {
            replyForm.style.display =
                replyForm.style.display === "none" ? "block" : "none";
        });

        replyForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const replyText = replyForm.querySelector("textarea").value.trim();
            if (replyText) {
                saveComment(markerId, replyText, comment.id);
                replyForm.querySelector("textarea").value = "";
            }
        });

        commentDiv.appendChild(replyForm);

        if (comment.replies && comment.replies.length > 0) {
            const repliesDiv = document.createElement("div");
            repliesDiv.style.paddingLeft = "20px";
            repliesDiv.style.marginTop = "10px";
            repliesDiv.style.borderLeft = "2px solid #e1e1e1";
            repliesDiv.style.maxHeight = "150px";
            repliesDiv.style.overflowY = "auto";
            repliesDiv.style.paddingRight = "10px";

            comment.replies.forEach((reply) => {
                const replyItem = createCommentElement(reply, markerId);
                repliesDiv.appendChild(replyItem);
            });
            commentDiv.appendChild(repliesDiv);
        }


        return commentDiv;
    };


    const fetchComments = async (markerId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/comments/fetch/?marker_id=${markerId}`, { withCredentials: true, });
            return response.data;
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };


    const saveComment = async (markerId, commentText, parentId = null) => {
        try {
            const sessionResponse = await axios.get(`${BASE_URL}/api/check-session/`, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (sessionResponse.data.isLoggedIn) {
                const userId = sessionResponse.data.user_id;
                const commentData = {
                    marker: markerId,
                    text: commentText,
                    user: userId,
                    parent_id: parentId,
                };

                const commentResponse = await axios.post(`${BASE_URL}/api/comments/`, commentData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else {
                console.error("User not logged in.");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };



    const fetchMarkerDetails = async (markerId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/markers/${markerId}/`);
            const data = await response.json();

            const iconType = data.icon_type;


            const interactionData = {
                marker_id: markerId,
                user: userId,
                icon_type: iconType,
            };

            const interactionResponse = await fetch(`${BASE_URL}/api/markers/interactions/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(interactionData),
            });

            const interactionDataJson = await interactionResponse.json();

            setMarkers((prevMarkers) =>
                prevMarkers.map((marker) =>
                    marker.id === markerId
            ? { ...marker, interaction_count: interactionDataJson.interaction_count }
            : marker
                )
            );

        } catch (error) {
            console.error("Error in fetchMarkerDetails:", error);
        }
    };


    const handleMarkerClick = (id, type) => {
        setSelectedMarkerId(parseInt(id));
        setSelectedMarkerType(type != null ? type : selectedIcon);
        setShowCommentBox(true);
    };

    const addMarkersAtLocation = async (lngLat, iconType) => {
        try {
            const sessionResponse = await axios.get(`${BASE_URL}/api/check-session/`, { withCredentials: true });

            if (sessionResponse.data.isLoggedIn) {
                const userId = sessionResponse.data.user_id;
                const project = sameUser ? selectedProject : JSON.parse(localStorage.getItem('project'));
                const markerData = {
                    icon_type: selectedIcon != null ? selectedIcon : selectedMarkerType,
                    longitude: lngLat.lng,
                    latitude: lngLat.lat,
                    user: userId,
                    project: project,
                    interaction_count: iconType === "comment" ? 0 : 1
                };

                createCustomMarkers(lngLat, selectedIcon);

                const resp = await axios.post(`${BASE_URL}/api/markers/`, markerData, { withCredentials: true });

                setMarkers([...markers, markerData]);
            } else {
                toast.error("User not logged in. Marker data not sent.");
            }
        } catch (error) {
            console.error("Error adding marker:", error);
        }
    };

    const setBoundaryFromPolygon = (polygons) => {
        const geojson = {
            type: "FeatureCollection",
            features: polygons.map((coordinates) => ({
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: coordinates,
                },
                properties: {},
            })),
        };

        if (boundarySourceRef.current) {
            boundarySourceRef.current.setData(geojson);
        } else {
            console.warn("Boundary source not found.");
        }
    };

    const handlePlaceSearch = async (place) => {
        if (!mapRef.current) {
            console.error("Map is not loaded yet.");
            return;
        }

        try {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${mapboxgl.accessToken}&types=place`);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const { center, geometry } = feature;

                const [lon, lat] = center;
                mapRef.current.flyTo({ center: [lon, lat], zoom: 16 });

                setSelectedRegion([{ latitude: lat, longitude: lon }]);

                if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
                    const polygons =
                        geometry.type === "Polygon"
                            ? [geometry.coordinates]
                            : geometry.coordinates;
                    setBoundaryFromPolygon(polygons);
                } else if (geometry.type === "Point") {
                    const circularPolygon = createCircularPolygon(center, 0.5, 100);
                    setBoundaryFromPolygon([circularPolygon.geometry.coordinates]);

                    const placeId = feature.id;
                    const detailedGeoJson = await fetchDetailedGeoJSON(placeId);
                    if (detailedGeoJson) {
                        setBoundaryFromPolygon(
                            detailedGeoJson.features.map((f) => f.geometry.coordinates)
                        );
                    }
                } else {
                    console.warn("Geometry type is not handled:", geometry.type);
                    setBoundaryFromPolygon([]);
                }
            } else {
                console.warn("No results found for the place.");
                setBoundaryFromPolygon([]);
            }
        } catch (error) {
            console.error("Error fetching place data:", error);
            setBoundaryFromPolygon([]);
        }
    };

    const fetchDetailedGeoJSON = async (placeId) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    placeId
                )}.json?access_token=${mapboxgl.accessToken}`
            );
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const features = data.features.map((feature) => ({
                    type: "Feature",
                    geometry: feature.geometry,
                    properties: feature.properties,
                }));

                return {
                    type: "FeatureCollection",
                    features,
                };
            }
        } catch (error) {
            console.error("Error fetching detailed GeoJSON:", error);
        }

        return null;
    };

    const createCircularPolygon = (center, radius, points) => {
        const coords = [];
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            const x = center[0] + radius * Math.cos(angle);
            const y = center[1] + radius * Math.sin(angle);
            coords.push([x, y]);
        }
        coords.push(coords[0]);
        return {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [coords],
            },
            properties: {},
        };
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            handlePlaceSearch(searchQuery);
        }
    };

    const fetchProjects = async () => {
        try {
            const projectResponse = await axios.get(`${BASE_URL}/api/projects/`, {
                withCredentials: true,
            });

            const projects = projectResponse.data.merged_data;
            setProjects(projects);

            const userResponse = await axios.get(`${BASE_URL}/api/users`, {
                withCredentials: true,
            })

            const isSameUser = (projects.length > 0) ? (projects[0].coupon.buyer === userResponse.data.buyer_id) : null;
            setSameUser(isSameUser);

        } catch (error) {
            console.error("Error occurred:", error);
        }
    };


    const selectProject = async (data) => {
        setSelectedProject(data);
        setShowToolbar(true);
        const regionParam = data.link.split("region=")[1].split("/invite")[0];

        const coordinates = regionParam.split(",").map(coord => {
            const [longitude, latitude] = coord.split("_");
            return { longitude: parseFloat(longitude), latitude: parseFloat(latitude) };
        });

        const polygonCoordinates = coordinates.map(coord => [coord.longitude, coord.latitude]);
        setBoundaryFromPolygon([polygonCoordinates]);
        const resp = await axios.post(`${BASE_URL}/api/projects/markers/`, { project: data }, { withCredentials: true })

        const markers = resp.data.markers;

        markers.forEach(marker => {
            createCustomMarkers(
                { lng: marker.longitude, lat: marker.latitude },
                marker.icon_type,
                marker.id,
                marker.user,
                marker.interaction_count
            );
        });

        mapRef.current.on("click", (e) => {
            const { lngLat } = e;
            if (isPointInPolygon(lngLat, polygonCoordinates)) {
                addMarkersAtLocation(lngLat, selectedIcon);
                setShowToolbar(true);
            } else {
                toast.error("You can only add markers inside the polygon.");
            }
        });

        if (mapRef.current.getLayer("polygon-border")) {
            mapRef.current.removeLayer("polygon-border");
            mapRef.current.removeSource("polygon-border");
        }

        mapRef.current.addLayer({
            id: "polygon-border",
            type: "line",
            source: {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [{
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [polygonCoordinates]
                        }
                    }]
                }
            },
            paint: {
                "line-color": "#000000",
                "line-width": 2
            }
        });

        const center = getPolygonCenter([polygonCoordinates]);
        mapRef.current.flyTo({ center, zoom: 16 });
    }

    return (
        <>
            <MapDashboard regionCoordinates={polygonCoordinates} generateLinkDisable={sameUser} />
            <br /><br />
            <div className="container-fluid py-4">
                <div className="row">
                    {/* Map Section */}
                    <div className="col-12 col-md-8 mb-4">
                        <div
                            ref={mapContainer}
                            className="map-container rounded shadow"
                            style={{ height: "600px", width: "100%" }}
                        ></div>
                    </div>

                    {/* Right Sidebar Section */}
                    <div className="col-12 col-md-4">
                        <div className="bg-white p-3 rounded shadow-sm">
                            {/* Search Form */}
                            <form onSubmit={handleSearchSubmit} className="mb-4">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    placeholder="Search for a place"
                                    className="form-control mb-3"
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    <FaSearch />
                                </button>
                            </form>

                            {/* Toolbar */}
                            {showToolbar && (
                                <div className="d-flex flex-column gap-3 mb-4">
                                    <button
                                        onClick={() => setSelectedIcon("like")}
                                        className="btn btn-success"
                                    >
                                        <FaThumbsUp /> Like
                                    </button>
                                    <button
                                        onClick={() => setSelectedIcon("dislike")}
                                        className="btn btn-danger"
                                    >
                                        <FaThumbsDown /> Dislike
                                    </button>
                                    <button
                                        onClick={() => setSelectedIcon("comment")}
                                        className="btn btn-warning"
                                    >
                                        <FaComment /> Comment
                                    </button>
                                </div>
                            )}

                            {/* Save Region */}
                            {!isRegionProvided && (
                                <button
                                    onClick={saveRegion}
                                    className="btn btn-success w-100 mb-4"
                                >
                                    Save Region
                                </button>
                            )}

                            {/* Projects List */}
                            {projects.length > 0 && sameUser && (
                                <div>
                                    <h4 className="mb-3">Projects</h4>
                                    <ul className="list-unstyled">
                                        {projects.map((item) => (
                                            <li key={item["project: "].id} className="mb-3">
                                                <div
                                                    className="p-3 border rounded bg-light"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => selectProject(item["coupon"])}
                                                >
                                                    <h6 className="mb-2">{item["project: "].name}</h6>
                                                    <p className="mb-0">Project ID: {item["project: "].id}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );

};

export default Map;