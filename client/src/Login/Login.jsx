import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { Card, Grid, Typography, Avatar } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const particleOpt = {
  particles: {
    number: {
      value: 250,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};
class Login extends Component {
  state = { stud: false, inst: false, we: false, s: false, i: false };
  exist = async () => {
    const { accounts, contract } = this.props;
    console.log(accounts[0]);

    // const response = await contract.methods
    //   .doesWalletExists(accounts[0])
    //   .call();
    
    const response = true;
    console.log("LOG RESPONSE",response);
    if (response == true) {
      console.log("HELLO FROM IF");
      this.setState({ we: true },() => {
        console.log(this.state.we, 'NEW LOG');
      });
    }
    // console.log(this.state.we);
  };
  componentDidMount = async () => {
    await this.exist();
  };

  render() {
    return (
      // <div>
      //   LOGIN
      //   <br />
      //   <button
      //     onClick={() => {
      //       this.setState({ res: true });
      //     }}
      //   >
      //     STUDENT
      //   </button>
      //   <button
      //     onClick={() => {
      //       this.setState({ ret: true });
      //     }}
      //   >
      //     INSTITUTE
      //   </button>{" "}
      //   {this.state.res ? <Navigate to="/createstud" /> : null}
      //   {this.state.ret ? <Redirect to="/createinst" /> : null}
      // </div>

      // <div style={{ height: "1000px", backgroundColor: "#2196f3" }}>
      //   <Grid container justify="center">
      //     <Grid item md={12}>
      //       <div>
      //         <h1 style={{ height: "300px" }} />
      //       </div>
      //     </Grid>
      //     <Grid item md={3}>
      //       <Card>
      //         <Typography variant="h4" style={{ textAlign: "center" }}>
      //           Student
      //         </Typography>
      //         <Grid container justify="center">
      //           <Button
      //             style={{ margin: "25px" }}
      //             variant="outlined"
      //             color="secondary"
      //             onClick={() => {
      //               this.setState({ stud: true });
      //             }}
      //           >
      //             Sign UP
      //           </Button>{" "}
      //           <br />
      //           <Button
      //             style={{ margin: "25px" }}
      //             variant="outlined"
      //             color="secondary"
      //             onClick={() => {
      //               this.setState({ s: true });
      //             }}
      //           >
      //             Login
      //           </Button>{" "}
      //         </Grid>
      //       </Card>
      //     </Grid>
      //     <Grid item md={1} />
      //     <Grid item md={3}>
      //       <Card>
      //         <Typography variant="h4" style={{ textAlign: "center" }}>
      //           Institute
      //         </Typography>{" "}
      //         <Grid container justify="center">
      //           <Button
      //             style={{ margin: "25px" }}
      //             variant="outlined"
      //             color="secondary"
      //             onClick={() => {
      //               this.setState({ inst: true });
      //             }}
      //           >
      //             Sign Up
      //           </Button>{" "}
      //           <br />
      //           <Button
      //             style={{ margin: "25px" }}
      //             variant="outlined"
      //             color="secondary"
      //             onClick={() => {
      //               this.setState({ i: true });
      //             }}
      //           >
      //             Login
      //           </Button>{" "}
      //         </Grid>
      //       </Card>
      //     </Grid>
      //   </Grid>
      //   <Card />

      
      <div style={{ height: "980px", backgroundColor: "#2196f3" }}>
        <Particles params={particleOpt} />

        <div style={{ position: "absolute", top: "250px", left: "225px" }}>
          <Grid container justifyContent="center">
            <Grid item md={3}>
              <div
                style={{ position: "absolute", marginLeft: "250px" }}
                className="shadow"
              >
                <Card
                  style={{
                    width: "400px",
                    height: "580px",
                    backgroundColor: "#e3f2fd"
                  }}
                >
                  <Typography
                    variant="h4"
                    style={{ textAlign: "center", padding: "25px" }}
                  >
                    Student
                  </Typography>
                  <Grid container justifyContent="center">
                    <Avatar style={{ width: "365px", height: "365px" }}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3068/3068327.png"
                        alt=""
                        style={{ height: "400px", margin: "10px" }}
                      />
                    </Avatar>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Button
                      style={{ margin: "25px" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        this.setState({ s: true });
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      style={{ margin: "25px" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        this.setState({ stud: true });
                      }}
                    >
                      Sign Up
                    </Button>{" "}
                  </Grid>
                </Card>
              </div>
            </Grid>
            <Grid item md={6} />
            <Grid item md={3}>
              <div
                style={{ position: "absolute", marginLeft: "750px" }}
                className="shadow"
              >
                <Card
                  style={{
                    width: "400px",
                    height: "580px",
                    backgroundColor: "#e3f2fd"
                  }}
                >
                  <Typography
                    variant="h4"
                    style={{ textAlign: "center", padding: "25px" }}
                  >
                    Institute
                  </Typography>
                  <Grid container justifyContent="center">
                    <Avatar style={{ width: "365px", height: "365px" }}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3533/3533210.png"
                        alt=""
                        style={{ height: "400px", margin: "10px" }}
                      />
                    </Avatar>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Button
                      style={{ margin: "25px" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        this.setState({ i: true });
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      style={{ margin: "25px" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        this.setState({ inst: true });
                      }}
                    >
                      Sign Up
                    </Button>{" "}
                  </Grid>
                </Card>
              </div>
            </Grid>
          </Grid>
          {/* <Particles params={particleOpt} /> */}
        </div>
        {this.state.stud ? <Navigate to="/createstud" /> : null}
        {this.state.inst ? <Navigate to="/createinst" /> : null}
        {this.state.stud ? <Navigate to="/GoogleLoginS" /> : null}
        {this.state.inst ? <Navigate to="/GoogleLoginI" /> : null}
        {this.state.s ? <Navigate to="/StudentDashBoard" /> : null}
        {this.state.i ? <Navigate to="/InstituteDashBoard" /> : null}
      </div>
    );
  }
}

export default Login;
