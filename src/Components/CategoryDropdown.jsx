import './CategoryDropdown.css';
import { GetData } from './funcionality/getcategories';
import { useState, useEffect } from 'react';
import { URLS } from './urls';

export default function CategoryDropdown({
    onCategoryChange,
    currentCategory,
}) {
    const [categoryList, setCategoryList] = useState([]);
    // const [currentCategory, setCurrentCategory] = useState(-1);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await GetData(URLS[0].Category_list);
            if (result) {
                setCategoryList(result);
            }
        };
        fetchCategories();
    }, []);

    const handleCategorySelection = (event) => {
        const selectedCategory = event.target.value;
        // setCurrentCategory(parseInt(selectedCategory, 10));
        onCategoryChange(selectedCategory);
    };

    return (
        <div className="bar-menu">
            <select value={currentCategory} onChange={handleCategorySelection}>
                {categoryList.map((item, index) => (
                    <option key={index} value={item.id}>
                        {item.product_count > 0
                            ? `${item.category_name} (${item.product_count})`
                            : `${item.category_name}`}
                    </option>
                ))}
            </select>
        </div>
    );
}
