pragma solidity >=0.5.16;
contract Ballot {

struct Documents {
    string aadhar;
}

struct RecruiterDetails
{
    address recruiter;
    address[] stud;
}

struct MultiSig
{
    address inst;
    address stud;
    string name;
    string email;
    string profilePic;
    string number;
    Documents[] documents;
    address[] recruiters;
}



mapping(address=>MultiSig) wallets ;

mapping(address=>RecruiterDetails) recruiterMap;


function createNewMultiSigbyUser(address instituteaddress) public {    

        MultiSig storage wa = wallets[msg.sender];
        wa.inst=instituteaddress;
        wa.stud=msg.sender; 

}

function createNewMultiSigInst(address studentaddress) public { 

        MultiSig storage wa = wallets[msg.sender];
        wa.inst=msg.sender;
        wa.stud=studentaddress; 

}

function changeOwnerInstFromStud(address changeaddress) public {  

        MultiSig storage wa = wallets[msg.sender];
        approveChangeOwnerINSTReqbyInst(wa.inst, changeaddress); 

}

function changeOwnerInstFromInst(address changeaddress) public {  

        approveChangeOwnerINSTReqbyInst(msg.sender, changeaddress); 

}

function approveChangeOwnerINSTReqbyInst(address instituteaddress, address changeaddress) public {

        MultiSig storage wa = wallets[instituteaddress];
        MultiSig storage stud_wal=wallets[wa.stud];
        stud_wal.inst=changeaddress; 

}

function getOwners(address accountAddress) public view returns (address[2] memory){

    MultiSig storage wa = wallets[accountAddress];
    return ([wa.inst,wa.stud]);

}

function getProfile(address accountAddress) public view returns (string[2] memory){

    MultiSig storage wa = wallets[accountAddress];
    return ([wa.name,wa.profilePic]);

}

function getChangeOwnerList(address accountAddress) public view returns( address[1] memory){

    MultiSig storage wa = wallets[accountAddress];
    return [wa.inst];

}

function createNewAccess(address studaddress, address recruiter) public{

    MultiSig storage wa= wallets[studaddress];
    wa.recruiters.push(recruiter);
    RecruiterDetails storage rd= recruiterMap[recruiter];
    rd.stud.push(studaddress);

}

function getIhaveaAccess(address recruiteraddress) public view returns(address[] memory){

    RecruiterDetails storage rd= recruiterMap[recruiteraddress];
    return rd.stud;

}

function getInstitutesWallet(address instaddress) public view returns(address){

    MultiSig storage wa= wallets[instaddress];
    return wa.stud;

}

function updateProf(string memory name, string memory profilePic,address accountAddress,string memory no, string memory email) public{
    
    MultiSig storage wa = wallets[accountAddress];

    wa.name=name;
    wa.profilePic=profilePic;
    
    wa.number=no;
    wa.email=email;
}

function uploadAadhar(string memory a) public {

    MultiSig storage wa=wallets[msg.sender]; 

    wa.documents.push(Documents(a));
}

function getAadhar(address stud) public view returns (Documents[] memory){

    MultiSig storage wa = wallets[stud];
    return wa.documents;
}

}

