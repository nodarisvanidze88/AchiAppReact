import React, { useEffect, useState, useCallback, useContext } from 'react';
import './GridImages.css';
import { URLS } from './urls';
import CategoryDropdown from './CategoryDropdown';
import { GetData } from './funcionality/getcategories';
import DetailModal from './detailModal';
import { IoMdExit } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { InvoiceContext } from './InvoiceContext';
export default function GridImages() {
    const [data, setData] = useState([]); // Store fetched data
    const [page, setPage] = useState(1); // Current page number
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [hasMore, setHasMore] = useState(true); // Flag to track if there are more items to load
    const [currentCategory, setCurrentCategory] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [details, setDetails] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [invoiceData, setInvoiceData] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const storedInvoice = localStorage.getItem('invoiceData');
        if (storedInvoice) {
            try {
                const parsedData = JSON.parse(storedInvoice);
                setInvoiceData(parsedData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.warn('No data found in localStorage for invoiceData');
        }
    }, []);
    const fetchNewData = async (reset = false) => {
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
    useEffect(() => {
        setData([]);
    }, [currentCategory]);

    useEffect(() => {
        const fetchData = async (reset = false) => {
            setIsLoading(true);
            try {
                const categoryParam =
                    currentCategory !== -1
                        ? `&category_id=${currentCategory}`
                        : '';
                const url = `${URLS[0].All_Items}?page=${page}${categoryParam}`;
                const result = await GetData(url);
                if (result && result.results) {
                    setData((prevData) =>
                        reset
                            ? result.results
                            : [...prevData, ...result.results]
                    );
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
        fetchData();
    }, [page, currentCategory]);

    const handleScroll = useCallback(
        (e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        },
        [hasMore]
    );
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const toggleModal = () => {
        setDetailsOpen(!detailsOpen);
    };
    const handleDetails = (item) => {
        setDetails(item);
    };
    const handleCategoryChange = (category) => {
        // setData([]);
        setCurrentCategory(parseInt(category, 10));
        setPage(1);
        setIsOpen(false);
    };
    const handleSelectedItem = (item) => {
        setSelectedItem(item);
    };
    const handleReturnBack = () => {
        navigate('/');
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
                {!isOpen && (
                    <>
                        <div className="customer-info">
                            <div>
                                
                                {invoiceData&&(<span>{invoiceData.customer}</span>)}
                            </div>
                        </div>
                    </>
                )}

                <button className="exit-button" onClick={handleReturnBack}>
                    <IoMdExit />
                </button>
            </div>
            <div
                className="grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
                onScroll={handleScroll}
            >
                {data.map((item, index) => (
                    <div key={index} className="cards">
                        <img
                            className="w-full h-auto object-cover rounded-xl"
                            src={item.image_urel}
                            alt={item.product_id}
                            onClick={() => {
                                handleDetails(item);
                                handleSelectedItem(item.id);
                                toggleModal();
                            }}
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
            </div>
            {invoiceData && (
    <DetailModal
        isOpen={detailsOpen}
        onRequestClose={() => {
            setDetailsOpen(false);
            setDetails([]);
        }}
        modalData={data}
        modalDataFunc={setData}
        getNewData={fetchNewData}
        currentPage={page}
        setCurrentPage={setPage}
        hasNext={hasMore}
        details={details}
        setdetail={setDetails}
        invoice={invoiceData.invoiceNumber}
        user_id={invoiceData.user_id}
        user={invoiceData.user}
        customer_id={invoiceData.customer_id}
    />
)}
        </div>
    );
}
