export const addItemValidator = (data: any, setErrors: (err: any) => void) => {
    const validateAddItem = () => {
        const newErrors: any = {}; 
        let hasError = false;

        // item name validator
        if (!data.item_name.trim()) {
            newErrors.item_name = 'Item Name is required.';
            hasError = true;
        }
        else {
            newErrors.item_name = '';
        }

        // item price validator
        if(data.price === 0.00) {
            newErrors.price = 'Item Price is required.';
            hasError = true;
        }
        else if (data.price <= 0.00) {
            newErrors.price = 'Item Price is invalid.';
            hasError = true;
        }
        else {
            newErrors.price = '';
        }

        // item quantity validator
        if(data.quantity < 0) {
            newErrors.quantity = 'Item Quantity is required.';
            hasError = true;
        }
        else {
            newErrors.quantity = '';
        }

        // item available validator
        if (typeof data.available !== 'boolean') {
            newErrors.available = 'Select if the item is available.';
            hasError = true;
        }
        else {
            newErrors.available = '';
        }

        setErrors(newErrors);
        return hasError;
    }

    return { validateAddItem };
}