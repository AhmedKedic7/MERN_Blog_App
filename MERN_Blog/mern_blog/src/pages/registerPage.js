import {useState} from "react";
import { Link } from "react-router-dom";


export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    async function register(ev){
        ev.preventDefault();
        
        const response=await fetch('http://localhost:4000/register',{
            method: 'POST',
            body: JSON.stringify({username,password}), 
            headers:{'Content-Type':"application/json"},
        });
        if(response.status === 200 && password===repeatPassword){
            alert("Registration successful!")
        }else{
            alert("Registration failed!")
        }        
        
    }
    return(
        <div className="register-form">
            <form className="register" onSubmit={register}>
                <h1>Sign up</h1>
                <input type="text" 
                placeholder="username" 
                value = {username} 
                onChange={ev => setUsername(ev.target.value)}/>
                <input type="password" id="pswd"
                placeholder="password" 
                value = {password} 
                onChange={ev=>setPassword(ev.target.value)}/>
                <input type="password"  id="repeat-pswd"
                placeholder="repeat password"
                value={repeatPassword}
                onChange={(ev) => setRepeatPassword(ev.target.value)}
                />
                
                <button>Sign up</button>
                <p>Don't have an account? <Link to={'/login'} className="form-link">Click here.</Link></p>                  
            </form>    
        </div>
    );
}