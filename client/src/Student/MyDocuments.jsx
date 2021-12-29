import React, { Component } from "react";
import { Grid, Typography, Avatar, Card, Button, useControlled } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExpPanel from "../CommonComponents/ExpPanel";
import green from "@material-ui/core/colors/green";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MailIcon from "@material-ui/icons/Mail";
import AlertDialog from "../CommonComponents/AlertDialog";
import ipfs from "../ipfs";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import FullScreenDialog from "../CommonComponents/FullScreenDialog";
import fire from "../Fire";
import TopNav from "./TopNav";
import StudDash from "./StudentDashBoard";
import verify from "../logo/verify.jpg";
import progress from "../logo/progress.jpg";
import deny from "../logo/deny.jpg";

class MyDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentHash:"",
      aadhar: [],
      a: "QmafSZjxx8QaqJJBEyxRej7D9E8STGCbLzwVRgT2U7ctug",
      hasAadhar: false,
      lastuploadername: "",
      lastuploaderadd: "",
      lastuploaderpic: "",
      aa: ""
    };
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  firebaseset = () => {
    try {
      const { accounts, contract } = this.props;

      fire
        .database()
        .ref()
        .child("UID")
        .child(accounts[0])
        .child("doc")
        .push().set([this.state.currentHash,"progress"]);
      
    } catch (fipu) {}
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  captureFile = async event => {
    const { accounts, contract } = this.props;
    event.preventDefault();
    const file = event.target.files[0];

    const added = await ipfs.add(file);
    this.setState({currentHash:added.path});
    this.setState(prevState => ({
      aadhar: [...prevState.aadhar, [added.path,false]]
    }));

    //this.setState({aadhar: [...prevState.aadhar, [added.path,false]]});

    
    this.setState({hasAadhar:true});
    this.firebaseset();

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      // this.setState({ buffer: Buffer(reader.result) });
      //   console.log("buffer", Buffer(reader.result));

      this.hj(Buffer(reader.result));
    };
  };

  hih = async () => {
    const { accounts, contract } = this.props;
    console.log("INSIDE HIH MYDOC");
    await contract.methods
      .uploadAadhar(this.state.aadhar)
      .send({ from: accounts[0] });
    const response = await contract.methods.getAadhar(accounts[0]).call();
      
    this.setState({ aadhar: response }); //check once
    console.log(this.state);
  };

  hj = async a => {
    await ipfs.add(a, (err, ipfsHash) => {
      console.log(err, ipfsHash);

      this.setState({ aadhar: ipfsHash[0].hash });
    });
  };

  newUpload = async () => {
    const { accounts, contract } = this.props;
    //console.log(this.state);
    await contract.methods
      .createUploadRequestbyUser(true, this.state.currentHash)
      .send({ from: accounts[0] });
    var t = await contract.methods
      .getUploadReqList(this.props.accounts[0])
      .call();
    console.log(t);

    this.handleClose();
  };

  getDoc = async () => {
    const { accounts, contract } = this.props;
    console.log("Called GetDoc");
    //var r = await contract.methods.getAadhar(accounts[0]).call();
    const response1 = await contract.methods.getProfile(accounts[0]).call();
    //this.setState({ aadhar: response1[0] });
    //this.setState({ profilepic: response1[1] });
    console.log(response1);
    var r=this.state.aadhar;
    console.log(r);
    if (r.length > 0) {
      window.open(`https://gateway.ipfs.io/ipfs/${r[0]}`);
    } else {
      window.alert("NULL");
    }
  };

  componentDidMount = async () => {
    const { accounts, contract } = this.props;
    
    console.log("DOC ACC",accounts);
    var r = await contract.methods.getAadhar(accounts[0]).call();
    if (r.length > 0) {
      this.setState({ hasAadhar: true });
    }
    var t = await contract.methods
      .getUploadReqList(accounts[0])
      .call();
    console.log(t);

    var ref = fire.database().ref();
    console.log(ref);

    ref.once("value", (userSnapshot) => {
    userSnapshot.child("UID").child(accounts[0]).child('doc').forEach((userSnapshot) => {
        
          console.log(userSnapshot);
          
          this.setState(prevState => ({
            aadhar: [...prevState.aadhar, userSnapshot.val()]
          }));
          
          this.setState({hasAadhar:true});
          
          console.log()
          
          console.log(this.state);
        });                          
  });

  const response1 = await contract.methods.getProfile(accounts[0]).call();
  this.setState({ lastuploadername: response1[0] });
  this.setState({lastuploaderadd:accounts[0]});
};         

  render() {
    
    return (
      <div>

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
          <Grid item md={1} />
          <Grid item md={5}>
            <Card
              style={{
                marginTop: "30px",
                marginLeft: "50px",
                marginRight: "50px",
                width: "800px"
              }}
            >
              <Grid container>
                <Grid item md={1}>
                  <Avatar
                    style={{ margin: "15px", backgroundColor: "#3F51B5" }}
                  >
                    <FolderIcon />
                  </Avatar>
                </Grid>
                <Grid item md={10}>
                  <Typography
                    variant="h4"
                    style={{
                      padding: "10px",
                      marginLeft: "15px",
                      color: "#3F51B5"
                    }}
                  >
                    My Documents
                    <Typography variant="caption" style={{ marginLeft: "5px" }}>
                      (Click on the Document name to view.)
                    </Typography>
                  </Typography>
                </Grid>
                
                {this.state.aadhar.map((aadhar, i) => {     
           console.log(aadhar);                 
           // Return the element. Also pass key     
           return (<ExpansionPanel style={{ width: "800px" }}>
           <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
             <Avatar
               style={{
                 color: "#fff",
                 backgroundColor: green[500]
               }}
             >
               <AssignmentIcon />
             </Avatar>
             <Typography style={{ margin: "10px" }}>
               Certificate {i+1}
             </Typography>

            {aadhar[1]==="true" ? <Avatar src={verify} style={{ height: "80px",width:"100px", marginLeft: "450px"}} /> : null}

            {aadhar[1]==="false" ? <Avatar src={deny} style={{ height: "80px",width:"100px", marginLeft: "450px"}} /> : null}

            {aadhar[1]==="progress" ? <Avatar src={progress} style={{ height: "80px",width:"100px", marginLeft: "450px"}} /> : null}

           </ExpansionPanelSummary>
           <ExpansionPanelDetails>
             <Grid container>
               <Grid item md={10}>
                 <Typography>
                   <em>Certificate </em> was uploaded by{" "}
                   <em>{this.state.lastuploadername}</em>. <br />
                   Uploader Address :{" "}
                   <em>{this.state.lastuploaderadd}</em>
                 </Typography>
               </Grid>
               <Grid item md={1}>
                 <Button
                   variant="outlined"
                   style={{ color: "green", marginLeft: "0px" }}
                   onClick={()=>{
                    window.open(`https://gateway.ipfs.io/ipfs/${aadhar[0]}`);
                   }}
                 >
                   {/* <FullScreenDialog
                   accounts={this.props.accounts}
                   contract={this.props.contract}
                 /> */}
                   View
                 </Button>
               </Grid>
             </Grid>
           </ExpansionPanelDetails>
         </ExpansionPanel>) 
        })}

              
                {/* array map the above content  */}
                <br />
                <Grid container justifyContent="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    style={{ marginTop: "15px", marginBottom: "15px" }}
                    onClick={this.handleClickOpen}
                  >
                    Add New Document{"      "}
                  </Button>

                  <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      <Typography style={{ color: "#1a237e" }} variant="h4">
                        Add New Document
                      </Typography>
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>Enter Document Name</DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                      />
                      <br />
                      <DialogContentText style={{ marginTop: "15px" }}>
                        Upload Document
                      </DialogContentText>

                      <Button>
                        {" "}
                        <input onChange={this.captureFile} type="file" />{" "}
                      </Button>
                      <Button>Upload </Button>
                    </DialogContent>
                    <DialogContent>
                      <DialogContentText style={{ marginTop: "15px" }}>
                        Upload a picture
                      </DialogContentText>
                      <Grid container justifyContent="center">
                        <img
                          src={`https://gateway.ipfs.io/ipfs/${
                            this.state.currentHash
                          }`}
                          alt="Your Uploaded Docs Here"
                          style={{
                            margin: "20px",
                            height: "250px",
                            width: "250px"
                          }}
                        />
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button
                        onClick={this.newUpload.bind(this)}
                        color="primary"
                      >
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default MyDocuments;
