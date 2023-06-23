/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Grid, Paper,TextField } from '@mui/material';
import axios from "axios";
import { toast } from "react-toastify";
import './Home.css'
import { useNavigate } from "react-router";
export default function Home() {
  const [user, setUser] = useState({});
  const navigate = useNavigate()
  const reloadPage= () => {
    window.location.reload();
  }
  useEffect(() => {
    // reloadPage()
    const auth_token = localStorage.getItem("auth_token");
    axios
      .get("http://localhost:8888/home", {
        headers: { Authorization: auth_token },
      })
      .then((response) => {
        console.log("response");
        setUser(response.data.user)
      })
      .catch((error) => {
        // console.log("hi12434")
        console.log(error);
      });
  }, []);

  const onClickHandler = (event) => {
    event.preventDefault();


    localStorage.removeItem("auth_token");
    navigate("/")

  };

  // const handleClick = () => {
  //   props.setPage('edit');
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 100);
  // }

  return (
    <div >
      <Grid>
                <Paper elevation={10} className="home">
                    <Grid align='center' className='header'>
                        <h3>View Profile</h3>
                    </Grid>
                        {/* <div className='image'>
                            <img src={user.profile} alt="Error" align='center'></img>
                        </div> */}
                    <TextField 
                        className='field' 
                        variant="outlined" 
                        value={user.name}
                        // label="FirstName"
                        disabled
                        fullWidth/>
                    <TextField 
                        className='field' 
                        variant="outlined"
                        // label="Email"
                        value={user.email}
                        disabled
                        fullWidth/>
                    <TextField 
                        className='field' 
                        variant="outlined"
                        value={user.password}
                        disabled
                        // label="Password"
                        fullWidth/>
                    <Button type='submit' 
                        color='primary' 
                        variant='contained' 
                        className='enter' 
                        onClick={onClickHandler}
                        fullWidth>
                            LogOut
                    </Button>
                </Paper>
                
            </Grid>
    </div>
  );
}
