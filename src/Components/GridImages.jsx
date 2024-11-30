import React, { useEffect, useState, useCallback } from 'react';
import './GridImages.css';
import { URLS } from './urls';

export default function GridImages() {
    const [data, setData] = useState([]); // Store fetched data
    const [page, setPage] = useState(1); // Current page number
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [hasMore, setHasMore] = useState(true); // Flag to track if there are more items to load
    const fetchData = async () => {
        if (isLoading || !hasMore) return; // Prevent multiple calls or fetch when no more data
        setIsLoading(true);

        try {
            const response = await fetch(`${URLS[0].All_Items}?page=${page}`);
            const result = await response.json();

            if (result.results) {
                setData((prevData) => [...prevData, ...result.results]); // Append new data to existing
                setHasMore(Boolean(result.next)); // If `next` is null, there are no more items
            } else {
                setHasMore(false); // No valid data structure
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the page changes
    useEffect(() => {
        if (!isLoading && hasMore) {
            fetchData();
        }
    }, [page]);

    // Handle scroll event
    const handleScroll = useCallback(() => {
        if (isLoading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            setPage((prevPage) => prevPage + 1); // Load the next page
        }
    }, [isLoading, hasMore]);

    // Attach scroll event listener with debounce
    useEffect(() => {
        const debouncedScroll = () => {
            setTimeout(() => {
                handleScroll();
            }, 300); // Debounce time
        };

        window.addEventListener('scroll', debouncedScroll);
        return () => window.removeEventListener('scroll', debouncedScroll); // Clean up
    }, [handleScroll]);

    return (
        <div className="grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {data.map((item, index) => (
                <div key={index} className="cards">
                    <img
                        className="w-full h-auto object-cover rounded-xl"
                        src={item.image_urel}
                        alt={item.product_id}
                    />
                </div>
            ))}
            {isLoading && <p>Loading...</p>} {/* Show loading indicator */}
            {!hasMore && <p>No more items to load.</p>} {/* Show end message */}
        </div>
    );
}
