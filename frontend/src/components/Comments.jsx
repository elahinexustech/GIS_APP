import React, { useState, useEffect } from "react";
import "./CommentSection.css";
import axios from 'axios';
import { toast } from 'react-toastify';

const CommentSection = ({ markerId, fetchComments, saveComment }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchComments(markerId).then(setComments);
    }, [markerId, fetchComments]);

    const handleNewCommentSubmit = () => {
        if (newComment.trim()) {
            saveComment(markerId, newComment).then((comment) => {
                setComments([...comments, comment]);
                setNewComment("");
            });
        }
    };

    const handleReplySubmit = (commentId, replyText) => {
        if (replyText.trim()) {
            saveComment(markerId, replyText, commentId).then((reply) => {
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId
                            ? { ...comment, replies: [...(comment.replies || []), reply] }
                            : comment
                    )
                );
            });
        }
    };

    return (
        <div className="comment-section">
            <textarea
                placeholder="Enter your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-area"
            />
            <button onClick={handleNewCommentSubmit} className="submit-btn">
                Submit
            </button>
            <div style={{ marginTop: "15px" }}>
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        markerId={markerId}
                        onReply={handleReplySubmit}
                    />
                ))}
            </div>
        </div>
    );
};

const Comment = ({ comment, markerId, onReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReplySubmit = (e) => {
        e.preventDefault();
        onReply(comment.id, replyText);
        setReplyText("");
        setShowReplyForm(false);
    };

    return (
        <div className="comment-div">
            <div className="comment-header">
                <strong>{comment.user.full_name}</strong>
                <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString()}
                </span>
            </div>
            <p>{comment.text}</p>
            <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="reply-btn"
            >
                Reply
            </button>
            {showReplyForm && (
                <form onSubmit={handleReplySubmit} style={{ marginTop: "10px" }}>
                    <textarea
                        placeholder="Enter your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="text-area"
                    />
                    <button type="submit" className="submit-btn">
                        Post Reply
                    </button>
                </form>
            )}
            {comment.replies?.length > 0 && (
                <div className="replies-div">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            markerId={markerId}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Comments = ({ markerId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchComments(markerId);
    }, [markerId]);

    const fetchComments = async (markerId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/comments/fetch/?marker_id=${markerId}`, { withCredentials: true });
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const saveComment = async (commentText, parentId = null) => {
        try {
            const sessionResponse = await axios.get("${BASE_URL}/api/check-session/", {
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

                const commentResponse = await axios.post("${BASE_URL}/api/comments/", commentData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                setComments([...comments, commentResponse.data]);
                setNewComment("");
            } else {
                console.error("User not logged in.");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            saveComment(newComment);
        }
    };

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.id} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                <strong>{comment.user.full_name}</strong>: {comment.text}
                {comment.replies.length > 0 && (
                    <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                        {renderComments(comment.replies)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment..."
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "8px 15px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Submit
                </button>
            </form>
            <div style={{ marginTop: "15px" }}>
                {renderComments(comments)}
            </div>
        </div>
    );
};

export default CommentSection;
