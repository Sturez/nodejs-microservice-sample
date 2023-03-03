import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        data: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });


    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();

    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group" >
                <label>Email</label>
                <input
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    className="form-control"
                    value={password}
                    autoComplete="off"
                    onChange={e => setPassword(e.target.value)}
                    type={"password"} />
            </div>
            <div>
                {errors}

                <button
                    type="submit"
                    className="btn btn-primary"
                >Sign In</button>
            </div>
        </form>
    );
}

export default SignIn;