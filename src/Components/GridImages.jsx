import React, { useEffect, useState, useCallback } from 'react';
import './GridImages.css';
import { URLS } from './urls';
import CategoryDropdown from './CategoryDropdown';
import { GetData } from './funcionality/getcategories';

export default function GridImages() {
    const [data, setData] = useState([]); // Store fetched data
    const [page, setPage] = useState(1); // Current page number
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [hasMore, setHasMore] = useState(true); // Flag to track if there are more items to load
    const [currentCategory, setCurrentCategory] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);

    const fetchData = async (reset = false) => {
        setIsLoading(true);
        try {
            const categoryParam =
                currentCategory !== -1 ? `&category_id=${currentCategory}` : '';
            const url = `${URLS[0].All_Items}?page=${page}${categoryParam}`;
            const result = await GetData(url);
            if (result && result.results) {
                setData((prevData) =>
                    reset ? result.results : [...prevData, ...result.results]
                );
                console.log(data);
                setHasMore(Boolean(result.next));
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset data and fetch when category changes
    useEffect(() => {
        setData([]);
        fetchData(true);
    }, [currentCategory]);

    // Fetch data when the page changes
    useEffect(() => {
        fetchData();
    }, [page]);

    const handleScroll = useCallback(
        (e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            // if (isLoading || !hasMore) return;

            if (scrollTop + clientHeight >= scrollHeight - 5) {
                setPage((prevPage) => prevPage + 1); // Load the next page
            }
        },
        [isLoading, hasMore]
    );
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const handleCategoryChange = (category) => {
        setCurrentCategory(parseInt(category, 10));
        setPage(1);
        setIsOpen(false);
    };

    return (
        <div className="main-container">
            <div className="burger-menu">
                <button className="burger-button" onClick={toggleDropdown}>
                    ☰
                </button>
                {isOpen && (
                    <CategoryDropdown
                        onCategoryChange={handleCategoryChange}
                        currentCategory={currentCategory}
                    />
                )}
            </div>
            <div
                className="grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
                onScroll={handleScroll}
            >
                {data.map((item, index) => (
                    <div key={index} className="cards">
                        <img
                            className="w-full h-auto object-cover rounded-xl"
                            src={item.image_urel}
                            alt={item.product_id}
                        />
                    </div>
                ))}
                {isLoading && (
                    <div className="loading-status">
                        <p>Loading...</p>
                    </div>
                )}{' '}
                {!hasMore && (
                    <div className="loading-status">
                        <p>No more items to load.</p>
                    </div>
                )}{' '}
                {/* Show end message */}
            </div>
        </div>
    );
}
