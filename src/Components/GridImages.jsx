import React, { useEffect, useState } from 'react';
import './GridImages.css';
import { URLS } from './urls';

export default function GridImages() {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch(URLS[0].All_Items)
            .then((res) => res.json())
            .then((res) => {
                setData(res);
            });
    }, []);

    return (
        <div className="grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {data.length > 0 && (
                data.map((item, index) => (
                    <div key={index} className='cards'>
                        <img className="w-full h-auto object-cover rounded-xl" src={item.image_urel} alt={item.product_id} />
                    </div>
                ))
            )}
        </div>
    );
}
