import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {BASE_URL} from '../../_CONST_';



const SharedLinkHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuthAndHandleLink = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/check-session/`, {
                    withCredentials: true,
                });

                if (response.status === 200) {

                    console.log(response.data.isLoggedIn)
                    if (response.data.isLoggedIn === true) {

                        // Redirect to maps page if authenticated and region exists
                        const searchParams = window.location.href;  // Get the full URL
                        const regionPart = searchParams.split('region=')[1];  // Extract the region part after 'region='

                        if (regionPart) {

                            const proj_resp = await axios.post("${BASE_URL}/api/projects/get", {
                                project_link: window.location.href
                            } , {withCredentials: true})

                            console.log(proj_resp.data, response.data)

                            const region_coordinates = regionPart.split('&')[0];  // Get the coordinates (before any '&' in case of other params)
                            if (response.data.is_buyer === false && proj_resp.data) {
                                localStorage.setItem("region", region_coordinates);
                                localStorage.setItem("project", proj_resp.data.project.id);
                            }
                        }

                        navigate(`/map`);
                    } else {
                        console.log("User not logged in");
                        localStorage.setItem('TEMP_LINK', window.location.href);
                        navigate(`/login?next=${location.pathname}${location.search}`);
                    }
                }
                
            } catch (error) {
                console.error("Error checking authentication:", error);
                localStorage.setItem('TEMP_LINK', window.location.href);
                navigate(`/login?next=${location.pathname}${location.search}`);
            }
        };

        checkAuthAndHandleLink();
    }, [navigate, location]);

    return null; // No UI, just handling logic
};

export default SharedLinkHandler;
