import React, { Component } from "react";
import { Grid, Typography, Card, Button } from "@material-ui/core";
import fire from "../Fire"
import TopNav from "../Student/TopNav";
import firebase from "firebase";
class ApproveUpload extends Component {
  state = {
    s: "0x8bb6d82f6ec5ea7a651f96f7b3353afb7caa8a47",
    array: []
  };

  verify = async () => {
    const { accounts, contract } = this.props;

    const iwall2 = await contract.methods
      .getInstitutesWallet(accounts[0])
      .call();
    console.log("KK", iwall2);
    var temp_iwall = [...new Set(iwall2)];
    var iwall= Array.from(temp_iwall);
    var array = [];
    iwall.map(async iwall => {
      var uplist = await contract.methods.getUploadReqList(iwall).call();
      console.log("AA", iwall);

      var temp_aadhar=[];

      var ref = fire.database().ref();
      console.log(ref);

      ref.once("value", (userSnapshot) => {
      userSnapshot.child("UID").child(iwall).child('doc').forEach((userSnapshot) => {
            console.log(userSnapshot);
            temp_aadhar.push(userSnapshot.val());
          });                          
    });

      var getDet = await contract.methods.getProfile(iwall).call();
      array.push({ add: iwall, b: uplist[0], name: getDet[0], pic: getDet[1], aadhar: temp_aadhar });
    });
    await this.sleep(2500);
    this.setState({ array: array });
    console.log("AS", array);

    // var t = await contract.methods.getUploadReqList(this.state.s).call();
    // console.log(t);
    // var r = await contract.methods.getAadhar().call();
    // console.log(r);
  };
  getDoc = async add => {
    const { accounts, contract } = this.props;
    // var r = await contract.methods.getUplaodReqPic(add, add).call();
    // console.log(r);
    // this.setState({ pic: r });
    if (add.length > 0) {
      window.open(`https://gateway.ipfs.io/ipfs/${add}`);
    } else {
      window.alert("NULL");
    }
  };

  componentWillMount = async () => {
    this.verify();
  };


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  firebaseset = (currentHash) => {
    try {
      const { accounts, contract } = this.props;

      fire
        .database()
        .ref()
        .child("UID")
        .child(accounts[0])
        .child("doc")
        .update([currentHash,true]);
      
    } catch (fipu) {}
  };


  appro = async (add,hash,status) => {
    const { accounts, contract } = this.props;

    var ref = fire.database().ref();
    console.log(ref);

    ref.once("value", (userSnapshot) => {
    userSnapshot.child("UID").child(add).child('doc').forEach((userSnapshot) => {
        
          console.log(userSnapshot.val()[0]);
          
          if(hash===userSnapshot.val()[0])
          {
            //userSnapshot.ref[1].update(true);
            userSnapshot.ref.update({1:status});
            
          }
          
        });                          
  });


    await contract.methods
      .approveUploadbyInstitute(add, add)
      .send({ from: accounts[0] });
    
  };

  render() {
    return (
      <div syle={{ }}>
        <Grid container justifyContent="flex-start">
        <Grid item md={12}>
                <TopNav
                  accounts={this.props.accounts}
                  contract={this.props.contract}
                />
              </Grid>
          <Grid item md={12} style={{ padding: "40px" }}>
                {" "}
          </Grid>
          </Grid>
        {this.state.array.map(jk => {
          return (
           
            <div>
              <Grid container style={{ marginTop: "60px" }}>
                <Grid item md={3} />
                <Grid item md={6}>

                {jk.aadhar.map((aadhar, i) => {
                  if(aadhar[1]==="progress"){
                      return(
                  <Card style={{ marginBottom: "25px" ,padding: "15px", width: "700px" }}>
                    <Typography variant="h4" color="primary">
                      Document Approval
                    </Typography>
                    <hr />
                    <Typography variant="headline">
                      <span>
                        Request from :{jk.name}
                        <br />
                        <em style={{ color: "#d50000" }}>
                          {jk.add.substring(0, 10)}
                        </em>
                      </span>
                    </Typography>
                    <br />
                    {/* <Typography variant="subheading">
                      <em>{this.props.requester} </em> has requested for{" "}
                      <em style={{ color: "#d50000" }}>{this.props.owntype}</em>{" "}
                      of your account!
                    </Typography> */}
                    <br />
                    <Grid container>
                      <Grid item md={3} />
                      <Button variant="outlined" 
                      onClick={this.appro.bind(this, jk.add, aadhar[0],"false")}
                      color="secondary">
                        Deny
                      </Button>
                      <Grid item md={1} />
                      <Button
                        variant="outlined"
                        onClick={this.getDoc.bind(this, aadhar[0])}
                        style={{ color: "#388e3c" }}
                      >
                        View
                      </Button>

                      <Grid item md={1} />
                      <Button
                        variant="outlined"
                        onClick={this.appro.bind(this, jk.add, aadhar[0],"true")}
                        style={{ color: "#388e3c" }}
                      >
                        Allow
                      </Button>
                    </Grid>
                    <br />
                    <Typography
                      variant="caption"
                      style={{ textAlign: "center" }}
                    >
                      (You can change your Account Prefernces by going int0 the
                      Account settings Page.)
                    </Typography>
                    </Card> )
                  }
                })}
                  {/* ENDS HERE */}

                </Grid>
              </Grid>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ApproveUpload;
