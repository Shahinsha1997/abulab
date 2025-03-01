import React, { useEffect, useMemo, useState } from 'react';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip  from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dummyArr, getLocalStorageData, isUnitNeededText, selectn } from '../utils/utils';
import dayjs from 'dayjs';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { testDetailObj } from '../utils/reportUtil';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Select, FormControl, InputLabel, MenuItem, Autocomplete, InputAdornment, styled } from '@mui/material';
import '../css/report.css'
import DeleteIcon from '@mui/icons-material/Delete';
function getFields ({
  hoverRowId, 
  handleMouseEnter,
  handleMouseLeave,
  handleDeleteTest,
  handleBold,
  testList=[],
  testObj,
  reportDatas
}){
  let prevHeading = '';
    return (
  <TableContainer sx={{
    "@media print": {
      "@page" : {
        marginBottom: '50px',
        marginTop: '150px',
        fontSize:'12px'
      }
    }}}>
      <Table>
        <TableHead>
          <TableRow sx={{'border':'2px solid black'}}>
            <TableCell sx={{width:'20%'}}><Typography fontFamily="Tahoma"><b>Investigation</b></Typography></TableCell>
            <TableCell sx={{width:'40%'}}><Typography fontFamily="Tahoma"><b>Result</b></Typography></TableCell>
            <TableCell><Typography fontFamily="Tahoma"><b>Ref Range</b></Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {testList.map((test, index) => {
             const { testValue, testName, refRange, heading, boldIndex, isUnitNeeded } = test;
             const prevHead = prevHeading;
             prevHeading = heading;
             return (
              <>
              {prevHead.toLowerCase() != heading.toLowerCase() && (
              <TableRow>
              <TableCell 
                 sx={{ 
                    fontWeight: "bold", 
                    fontStyle: "italic", 
                    textDecoration: "underline", 
                    textAlign: "center", 
                    fontSize: "1.1rem",
                    color: "#333",
                    border:'none'
                 }}
               >
                 {heading}
               </TableCell></TableRow>)}
            <TableRow id={index} key={index} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              
              <TableCell sx={{'border':'none', width:'20%'}}>
                <Typography fontFamily="Tahoma">{testName}</Typography>
              </TableCell>
              <TableCell sx={{'border':'none',width:'40%'}}>
                {!isUnitNeeded ? (
                    <TextField
                    multiline
                    variant="standard"
                    fullWidth
                    defaultValue={testValue}
                  />
                ): testValue.split(",").map((val, valIndex)=>
                <>
                    <TextField 
                    autoResize 
                    fontFamily="Tahoma" 
                    variant="standard" 
                    size= "small" 
                    defaultValue="17.6"
                    sx={{"& .MuiInputBase-input": {
                      fontWeight: boldIndex[valIndex] ? "bold" : 'normal', 
                    },
                    minWidth: '55px',maxWidth:'150px', fontSize: '1rem', marginLeft:'2px', }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end" sx={{ color: "black" }} onClick={()=>handleBold(valIndex,index)}>{boldIndex[valIndex] ? (<b>{val}</b>) : val}</InputAdornment>,
                    }}
                    />
                    {/* <Typography fontFamily="Tahoma" sx={{display: 'inline-block', fontSize: '1rem'}}>{val}</Typography> */}
                </>
            )}
               
              </TableCell>
              <TableCell sx={{'border':'none'}}>
              <Typography fontFamily="Tahoma"><span dangerouslySetInnerHTML={{__html: refRange.replace("\n","<br>")}} /></Typography>
              </TableCell>
              <TableCell className='no-print' sx={{display: index === hoverRowId ? 'block': 'none','border':'none'}}>
                <DeleteIcon onClick={()=>handleDeleteTest(index)} />
              </TableCell>
            </TableRow></>
            )})}
        </TableBody>
      </Table>
    </TableContainer>
    )
}
function ReportDv() {
    const  { reportId:id } = useParams();
    const reportObj = getLocalStorageData("datas","{}")[id] || {};
    if(!id){
        window.open('/login','_self')
    }
    if(!reportObj){
      return "Seems like data not found please go to dashboard and open the report again"
    }
    const [ hoverRowId, setHoverRowId] = useState('');
    const reportDatas = getLocalStorageData("reportDatas","{}");
    const testArr = reportObj.description.split("|");
    const reportArr = Object.values(reportDatas);
    const failedTestNames = [];
    const [state, setState] = useState({
      drName : reportObj.drName || '',
      age: '',
      gender: "F",
      testList: useMemo(()=>{
        const testLists = [];
        // for(let i=0;i<10;i++){
          testArr.map(val=>{
            let valPresent = false;
            val &&
            reportArr.map(reports=>{
              if(reports.parentTestName == val){
                const { testValue } = reports;
                const isUnitNeeded = testValue.includes(isUnitNeededText);
                valPresent = true;
                testLists.push({...reports,isUnitNeeded, testValue: testValue.replace(isUnitNeededText,''), boldIndex:isUnitNeeded ? testValue.split(",").map(val=>false) : [] })
              }
            })
            if(!valPresent && val){
              failedTestNames.push(val);
            }
          })
        // }
        return testLists.sort((a,b)=>{
          if (a.parentTestName !== b.parentTestName) {
            return a.parentTestName.localeCompare(b.parentTestName);
          }
          return a.heading.localeCompare(b.heading);
        })
      },[testArr, reportArr])
    })
    if(failedTestNames.length){
      return alert(`Following test names are not found in the report ${failedTestNames.join(",")}. Please add reports for these test names`)
    }
    const { drName, testList } = state;
    const [searchTerm, setSearchTerm] = useState('');
    const handleFieldChange = (e,val)=>{
      const { name, value } = e.target;
      setState({...state, [name]: val || value, [name+"Length"]: Math.min(200 + (val||value).length * 10, 150)})
    }

    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const handleDeleteTest = (index) =>{
      testList.splice(index, 1);
      setState({...state, testList: [...testList]})
    }
    const handleBold = (valIndex, index)=>{
      const test = testList[index];
      test.boldIndex[valIndex] = !test.boldIndex[valIndex]
      testList[index] = test;
      setState({...state, testList: [...testList]})
    }
    // useEffect(()=>{
    //   getData(id).then(res=>{
    //     setReportObj(res.obj[res.ids[0]])
    //   })
    // },[])
    const{ name } = reportObj;
    const handleMouseEnter = (el)=>{
      setHoverRowId(parseInt(el.currentTarget.id))
    }
    const handleMouseLeave = ()=>{
      setHoverRowId('')
    }
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };
    return (
        <Box className='firpage' sx={{ 
          border: '2px solid #00bcd4',
          margin:'10px',
          borderRadius: '5px',
          "@media print": {
            border: 'none',
          }
          }}  >
        <Box sx={{padding:"30px"}}>
        <Tooltip title="Page">
        {/* <Typography sx={{ marginLeft: '1020px'}} className='pageno'>1/1</Typography> */}
        </Tooltip><div className='fist'>
        <Typography fontFamily="Tahoma" sx={{ fontSize: '18px'}} className='Pana'>  Patient Name
        <Typography fontFamily="Tahoma" sx={{marginLeft: '30px', fontSize: '18px' ,display: 'inline-block'}}> <b> : </b> {name} </Typography> 
        </Typography><br/>
        <Typography fontFamily="Tahoma" sx={{ fontSize: '18px'}}>  Age / Sex
        <Typography fontFamily="Tahoma" sx={{marginLeft: '65px', fontSize: '18px' ,display: 'inline-block'}}> <b> : </b> </Typography> 
          <TextField fontFamily="Tahoma" variant="standard" size= "small"  className=".MuiOutlinedInput-root"  placeholder="Age" 
          sx={{fontSize: '18px', color:'black', width: '25px', marginLeft: '5px',}}/>
          <Typography fontFamily="Tahoma" sx={{marginLeft: '2px', fontSize: '15px' ,display: 'inline-block'}}>  / </Typography> 
          <TextField fontFamily="Tahoma" variant="standard" size= "small"  className=".MuiOutlinedInput-root"  placeholder="Sex" 
          sx={{fontSize: '18px',color:'black', width: '15px', marginLeft: '5px',}}/>
        </Typography><br/>

        <Typography fontFamily="Tahoma" sx={{ fontSize: '18px'}}> Date
        <Typography fontFamily="Tahoma" sx={{marginLeft: '110px', fontSize: '18px' ,display: 'inline-block'}}> <b> : </b> </Typography> 
        <LocalizationProvider dateAdapter={AdapterDayjs}><DateField sx={{fontSize: '18px', color:'black', marginLeft: '5px'}} variant='standard' value={dayjs(Date.now())} format="DD-MM-YYYY"/></LocalizationProvider>
        </Typography><br/>

        <Typography fontFamily="Tahoma" sx={{fontSize: '18px'}}> Ref.By
        <Typography fontFamily="Tahoma" sx={{marginLeft: '95px', fontSize: '18px' ,display: 'inline-block'}}> <b> : </b> </Typography> 
        <TextField multiline fontFamily="Tahoma" variant="standard" size= "small"  className=".MuiOutlinedInput-root" 
        sx={{width: '250px', fontSize: '18px', color:'black', marginLeft: '5px'}} name="drName" value={drName} onChange={handleFieldChange}/>
        </Typography><br/></div>
        {/* <Autocomplete
                className='no-print'
                value={searchTerm}
                id={'testList'}
                options={testListArr || []}
                onChange={handleAddTest}
                renderInput={(params) => 
                  <TextField
                    {...params}
                    label="Test Name"
                    variant="outlined"
                    placeholder="Search Test"
                    id="testListInput"
                    onChange={handleSearch}
                    autoComplete="off"
                    sx={{ 'width': '200px' }}
                />
            }
                /> */}
        {/* <Box sx={{border: '1px solid black'}}>
        <Typography fontFamily="Tahoma"> <b> Investigation </b>
        <Typography fontFamily="Tahoma" sx={{marginLeft: '200px', display:'inline-block'}} className='Result'> <b> Result </b></Typography>
        <Typography fontFamily="Tahoma" sx={{marginLeft: '200px', display:'inline-block'}} className='RefRange'> <b> Ref.Range </b> </Typography>
        </Typography>
        </Box> */}
        {getFields({
          hoverRowId,
          handleMouseEnter,
          handleMouseLeave,
          handleDeleteTest,
          testList,
          handleBold
        })}
        <Typography fontFamily="Tahoma" align='right' sx={{marginTop:'30px',marginRight:'20px', fontSize: '18px'}}><b>LABINCHARGE</b></Typography>
        </Box>
        </Box>
    );
    }
export default ReportDv



// Expense - Lab Expense + External Lab Expense
// Personal - Only Personal Expense