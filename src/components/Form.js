import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { APPOINTMENTS_VIEW, EXPENSE_LABEL, getAmountVal, getAsObj, getEditedFormProperties, getIdPrefix, getLocalStorageData, getProperId, getStatus, isFormErrorFound, setLocalStorageData } from '../utils/utils';
import IncomeForm from './IncomForm';
import ExpenseForm from './ExpenseForm'
import TestForm from './TestForm';
const Form = ({
  addData,
  data,
  formType, 
  toggleForm, 
  previousID, 
  showAlert,
  setPreviousId,
  setSyncStatus,
  isAdmin,
  drNamesList,
  testObj,
  testArr,
  multiTestAdd,
  page,
  dueWithMobile,
  patientIdObj,
  setDetailViewId
}) => {
  const isAddForm = (page == APPOINTMENTS_VIEW && data[formType]) || formType.indexOf('add') != -1
  const isIncomeForm = (page == APPOINTMENTS_VIEW && data[formType]) || formType.indexOf('Income')!=-1 || (!isAddForm && data[formType] && data[formType].status != EXPENSE_LABEL);
  const isMobile = useMediaQuery('(max-width: 600px)');
  
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    toggleForm()
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={formType}
      >
        <Box sx={{width: isMobile ? "100vw" : "350px"}}>
        <List dense={true}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="close" onClick={toggleDrawer(false)}>
                      <CloseIcon/>
                    </IconButton>
                  }
                >
                    <Typography gutterBottom style={{fontSize: '1.5rem'}} component="div">
                     {formType == 'addTests' ? 'Add Test Form' : isIncomeForm ? `${isAddForm ? 'Add' : 'Edit'} Income Form` : `${isAddForm ? 'Add' : 'Edit'} Expenses`}
                    </Typography>
                </ListItem>
            </List>
            {isIncomeForm ? (
              <IncomeForm
                getIdPrefix={getIdPrefix}
                toggleDrawer={toggleDrawer}
                isAdmin={isAdmin}
                isAddForm={isAddForm}
                drNamesList={drNamesList}
                testArr={testArr}
                testObj={testObj}
                dueWithMobile={dueWithMobile}
                patientIdObj={patientIdObj}
                page={page}
                previousID={previousID}
                setPreviousId={setPreviousId}
                data={data}
                formType={formType}
                showAlert={showAlert}
                addData={addData}
                setSyncStatus={setSyncStatus}
                toggleForm={toggleForm}
                setDetailViewId={setDetailViewId}

            />
            ) : formType == 'addTests' ? (
              <TestForm   
                formType={formType}
                toggleDrawer={toggleDrawer}
                showAlert={showAlert}
                testArr={testArr}
                multiTestAdd={multiTestAdd}
              />
            ): (
              <ExpenseForm
                formType={formType}
                data={data}
                toggleDrawer={toggleDrawer}
                isAdmin={isAdmin}
                isAddForm={isAddForm}
                showAlert={showAlert}
                addData={addData}
                setSyncStatus={setSyncStatus}
              />
            )}
            
        </Box>
      </Drawer>
    </>
  );
};

export default Form;
