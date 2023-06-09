import axios from "axios";
import { useState } from "react";

/**
 * 
 * 
 * @param {URL} url:
 * @param {Verb} method: get,post,put... whatever :) 
 * @param {any} data: json objet to eventually send 
 */
const useRequest = ({ url, method, data, onSuccess }) => {
    const [errors, setErrors] = useState([]);

    const doRequest = async (props = {}) => {
        setErrors(null);
        try {
            const response = await axios[method](url, { ...data, ...props });

            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;

        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oooops....</h4>
                    <ul>
                        {err.response.data.map(err => {
                            return (
                                <li key={err.message} >
                                    {err.message}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        }

    }

    return { doRequest, errors };
};

export default useRequest;