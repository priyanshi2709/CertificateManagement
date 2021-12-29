import React, { Component } from "react";
import TopNav from "../Student/TopNav"
import { Grid, Typography, Avatar, Card, Button } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import AssignmentIcon from "@material-ui/icons/Assignment";
import green from "@material-ui/core/colors/green";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MailIcon from "@material-ui/icons/Mail";
import fire from "../Fire";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@material-ui/core";

import ipfs from "../ipfs";
import SelectInput from "@material-ui/core/Select/SelectInput";
class LinkedAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hj: [],
      currentState: { a: "", b: "", name: "", pic: "",aadhar:[] },
      newinstadd: "",
      hasAadhar: ""
    };
    
  }
  
  getDoc = async a => {
    const { accounts, contract } = this.props;
    //var r = await contract.methods.getAadhar(a).call();
    //console.log("r",r);
    if (a.length > 0) {
      window.open(`https://gateway.ipfs.io/ipfs/${a}`);
    } else {
      window.alert("NULL");
    }
  };

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  componentWillMount = async () => {
    const { accounts, contract } = this.props;
    //this.state.hj=await this.verify();
    const linked_accts=await this.verify();
    await this.sleep(1000);
    this.setState({hj:linked_accts});
    console.log("LINKED_ACCTS",linked_accts);

    //console.log("HJ LOGGGGG",this.state.hj[0].aadhar);
    
    var r = await contract.methods.getAadhar(accounts[0]).call();
    if (r.length > 0) {
      this.setState({ hasAadhar: true });
    }
  };
  verify = async () => {
    const { accounts, contract } = this.props;

    const re = await contract.methods.getInstitutesWallet(accounts[0]).call();
    var h = [];
    console.log("INSIDE VERIFY");
    
    var i=0;

    re.map(async re => {
      var flag=false;
      var assa = await contract.methods.getChangeOwnerList(re).call();
      console.log("Accounts", re);

      var getDet = await contract.methods.getProfile(re).call();

      for(var i=0;i<h.length;i++)
      {
        if(h[i].a==re)
        {
          flag=true;
        }
      }

    var temp_aadhar=[];

    var ref = fire.database().ref();
    console.log(ref);

    ref.once("value", (userSnapshot) => {
    userSnapshot.child("UID").child(re).child('doc').forEach((userSnapshot) => {
        
          console.log(userSnapshot);
          
          // this.setState(prevState => ({
          //   aadhar: [...prevState.aadhar, userSnapshot.val()]
          // }))

          temp_aadhar.push(userSnapshot.val());
        });                          
  });



      if(!flag)
      {
        h.push({ a: re, b: assa[0], name: getDet[0], pic: getDet[1], aadhar:temp_aadhar });
      }
      
      console.log(h);
      
    });
    return h;
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClickOpen1 = () => {
    this.handleClose();
    this.setState({ open1: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleClose1 = () => {
    this.handleClose();
    this.setState({ open1: false });
  };

  captureFile = async event => {
    event.preventDefault();
    const file = event.target.files[0];
    console.log(event.target.files);

    const added= await ipfs.add(file);
    
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      
      this.hj(Buffer(reader.result));
    };
  };

  onCreate = async () => {
    const { accounts, contract } = this.props;

    await contract.methods
      .createUploadRequestbyInstitute(
        this.state.currentState.a,
        true,
        this.state.profilepic
      )
      .send({ from: accounts[0] });
    var uplist = await contract.methods
      .getUploadReqList(this.state.currentState.a)
      .call();
    console.log(uplist);
    {
      this.handleClose();
    }
  };

  hj = async a => {
    await ipfs.add(a, (err, ipfsHash) => {
      console.log(err, ipfsHash);

      this.setState({ profilepic: ipfsHash[0].hash });
    });
  };
  changeinst = async () => {
    const { accounts, contract } = this.props;
    await contract.methods
      .changeOwnerInstfromInst(this.state.currentState.a, this.state.newinstadd)
      .send({ from: accounts[0] });
    var r = await contract.methods
      .getChangeOwnerList(this.state.currentState.a)
      .call();
    console.log(r);
    
    const response = await contract.methods
      .getOwners(this.state.currentState.a)
      .call();
    console.log("owner:Institute:" + response[1]);
    console.log("owner:Student:" + response[0]);
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "white",
          height: "1000px",
          
        }}
      >
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
        <Typography variant="h4" style={{ padding: "20px", color: "#3F51B5" }}>
          Linked Accounts
          <br />
        </Typography>

        {this.state.hj.map(hj => {
          return (
            <div>
              <div>
              <Grid container>
                  <Grid item md={1} />
                  <Grid
                    item
                    md={8}
                    style={{ width: "400px", paddingTop: "50px" }}
                  >
                    <Card style={{ width: "900px" }}>
                      <Grid container style={{ padding: "20px" }}>
                        <Grid container>
                          <Grid item md={2} style={{ marginLeft: "25px" }}>
                            <Avatar
                              style={{
                                color: "#fff",
                                backgroundColor: green[500],
                                width: "75px",
                                height: "75px"
                              }}
                              // src={hj.pic}
                              src={`https://gateway.ipfs.io/ipfs/${hj.pic}`}
                            />
                          </Grid>

                          <Grid item md={4}>
                            <Typography variant="headline">
                              {hj.name}
                            </Typography>
                            <Typography variant="overline">
                              ADDRESS : {hj.a.substring(0, 10)}
                            </Typography>

                            <br />
                          </Grid>
                          <Grid item md={1} />
                          <Grid item md={1}>
                            <br />
                            <Button
                              onClick={() => {
                                this.setState({
                                  open: !this.state.open,
                                  currentState: hj
                                });
                              }}
                              variant="outlined"
                            >
                              View
                            </Button>
                          </Grid>
                          <Grid item md={1} />
                          <Grid item md={1}>
                            <br />
                            <Button
                              onClick={() => {
                                this.setState({
                                  open1: !this.state.open1,
                                  currentState: hj
                                });
                              }}
                              style={{ width: "200px" }}
                              variant="outlined"
                            >
                              Change Institute
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </div>

              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <div style={{ marginLeft: "30px", marginRight: "30px" }}>
                  <DialogTitle id="form-dialog-title">
                    <Typography style={{ color: "#1a237e" }} variant="h4">
                      Profile
                    </Typography>
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText style={{ color: "black" }}>
                      <Typography variant="h5">
                        {" "}
                        Name : {this.state.currentState.name}
                      </Typography>
                      <Typography variant="overline">
                        ADDRESS : {this.state.currentState.a}
                      </Typography>
                    </DialogContentText>
                    <br />
                    {/* <DialogContentText style={{ marginTop: "15px" }}>
              Create New Upload
            </DialogContentText> */}
                    <Grid container justifyContent="center">
                      <img
                        src={`https://gateway.ipfs.io/ipfs/${hj.pic}`}
                        alt="CNN"
                        style={{
                          margin: "20px",
                          height: "200px",
                          width: "200px"
                        }}
                      />
                    </Grid>{" "}
                    <DialogContentText style={{ color: "black" }}>
                      Documents{" "}
                      <Typography variant="caption">
                        (Click to send View Request)
                      </Typography>
                    </DialogContentText>
                    {hj.aadhar.map((aadhar, i) => {
                      
                    return(
                    <List style={{ width: "500px" }}>
                     
                     <ListItem button>
                        <ListItemText>Certificate {i+1} </ListItemText>
                        {/* <Button>
                          <input onChange={this.captureFile} type="file" />
                        </Button> */}

                        <Button
                          onClick={this.getDoc.bind(
                            this,
                            aadhar[0]
                          )}
                          variant="outlined"
                        >
                          view Doc
                        </Button>
                      </ListItem>
                      <Divider /> 
                   
                    </List> )
                     })}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                      Close
                    </Button>

                    {/* <Button onClick={this.onCreate} color="primary">
                      Create New Upload Request
                    </Button> */}
                  </DialogActions>
                </div>
              </Dialog>
              <Dialog
                open={this.state.open1}
                onClose={this.handleClose1}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  <Typography style={{ color: "#1a237e" }} variant="h4">
                    Change Institute Of student
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText style={{ color: "black" }}>
                    <Typography variant="h5">
                      {" "}
                      Name : {this.state.currentState.name}
                    </Typography>
                    <Typography variant="overline">
                      ADDRESS : {this.state.currentState.a}
                    </Typography>
                    <Typography variant="h6">
                      Enter Address of new Institute
                    </Typography>
                  </DialogContentText>
                  <TextField
                    id="standard-with-placeholder"
                    label="Address*"
                    placeholder="Enter Address"
                    margin="normal"
                    style={{ width: "250px" }}
                    onChange={e => {
                      {
                        this.setState({ newinstadd: e.target.value });
                      }
                    }}
                  />{" "}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose1} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.changeinst} color="primary">
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          );
        })}
      </div>
    );
  }
}

export default LinkedAccount;
