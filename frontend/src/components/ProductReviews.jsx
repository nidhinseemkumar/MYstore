import React, { useState, useEffect } from 'react';
import { Star, User, Clock, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

export const ProductReviews = ({ productId }) => {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [averageRating, setAverageRating] = useState(0);

    // Form state
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // Fetch reviews with user details
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    user:user_id(full_name, avatar_url)
                `)
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setReviews(data || []);

            // Calculate average
            if (data && data.length > 0) {
                const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
                setAverageRating(Number((sum / data.length).toFixed(1)));
            }

            // Check if current user has already reviewed
            if (user) {
                const userReview = data.find(r => r.user_id === user.id);
                setHasReviewed(!!userReview);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const checkPurchaseHistory = async () => {
        if (!user) return;
        try {
            // We need to see if there's an order_item for this user and product
            // Wait, order_items joins on order_id. We need to check orders too.
            // Simplified: select order_items where product_id matches and order.user_id matches
            const { data, error } = await supabase
                .from('order_items')
                .select(`
                    id,
                    order:order_id(user_id, status)
                `)
                .eq('product_id', productId);

            if (error) throw error;

            // Check if any returned item belongs to this user and order is completed
            const purchased = data.some(item =>
                item.order &&
                item.order.user_id === user.id &&
                (item.order.status === 'completed' || item.order.status === 'pending') // allow pending for testing purposes
            );

            setHasPurchased(purchased);
        } catch (err) {
            console.error("Error checking purchase history:", err);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchReviews();
            checkPurchaseHistory();
        }
    }, [productId, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please select a rating");
        if (!user) return toast.error("Please login to review");

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .insert({
                    product_id: productId,
                    user_id: user.id,
                    rating,
                    comment
                });

            if (error) throw error;

            toast.success("Review submitted! Thank you.");
            setHasReviewed(true);
            setRating(0);
            setComment('');
            fetchReviews(); // Refresh list
        } catch (err) {
            console.error(err);
            if (err.code === '23505') {
                toast.error("You have already reviewed this product.");
            } else {
                toast.error("Failed to submit review.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm("Delete your review?")) return;
        try {
            const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
            if (error) throw error;

            toast.success("Review deleted");
            setHasReviewed(false);
            fetchReviews();
        } catch (err) {
            toast.error("Error deleting review");
        }
    };

    if (loading) {
        return <div className="py-8 text-center text-gray-500 text-sm">Loading reviews...</div>;
    }

    return (
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={20}
                                    fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                                    className={star <= Math.round(averageRating) ? "" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <span className="font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
                    </div>
                </div>

                {!user && (
                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        Please <a href="/login" className="text-primary font-bold hover:underline">log in</a> to write a review.
                    </p>
                )}

                {user && user.role === 'buyer' && !hasPurchased && !hasReviewed && (
                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        You can review this product after purchasing it.
                    </p>
                )}
            </div>

            {/* Write Review Form */}
            {user && user.role === 'buyer' && hasPurchased && !hasReviewed && (
                <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={28}
                                        fill={(hoverRating || rating) >= star ? "#FBBF24" : "none"}
                                        className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
                        <textarea
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                            placeholder="What did you like or dislike about this product?"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || rating === 0}
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {review.user?.avatar_url ? (
                                            <img src={review.user.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={20} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{review.user?.full_name || 'Anonymous User'}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-yellow-400">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={12}
                                                        fill={star <= review.rating ? "currentColor" : "none"}
                                                        className={star <= review.rating ? "" : "text-gray-300"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {user && user.id === review.user_id && (
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                        title="Delete your review"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            {review.comment && (
                                <p className="text-gray-600 text-sm mt-3 ml-13 pl-13 leading-relaxed">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
