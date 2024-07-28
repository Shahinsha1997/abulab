import React, { useState } from 'react';
import SettingsForm from './SettingsForm';
import DepartmentsList from './DepartmentList';
import UsersList from './UsersList';
import ProfileList from './ProfileList';
import DepartmentForm from './DepartmentForm';
import ProfileForm from './ProfileForm';
import { useMediaQuery } from '@mui/material';
import UserForm from './UserForm';
const FormContainer = ({ 
    formObj,
    isFormLoading,
    handleFormType
  }) => {
    const {type, id} = formObj;
    const prevForm = ()=>{
      const page = id ? type : 'settingsPage'
      handleFormType(page, '')
    }

    const formComponents = {
      'departments': {
        list: DepartmentsList,
        form: DepartmentForm,
        title:'Departments'
      },
      'profiles': {
        list: ProfileList,
        form: ProfileForm,
        title:'Profiles'
      },
      'users': {
        list: UsersList,
        form: UserForm,
        title:'Users'
      },
    };
    const submitBtn = (datas)=>{

    }
    const commonProps = {
      backPage: prevForm,
      prevRecord: prevForm,
      isFormLoading,
      toggleForm: handleFormType,
      setFormObj: handleFormType,
      formWidth:'400px',
      isMobile: useMediaQuery('(max-width: 600px)'),
      id,
      submitBtn: id ? submitBtn : ''
    };
    const getFormComponent = (type, id, props) => {
      const formConfig = formComponents[type];
    
      if (!formConfig) {
        return null; // Handle invalid type
      }
    
      const { list, form, title } = formConfig;
    
      const Component = id ? form : list;
      const formTitle = id ? (id == 'add' ? `Add ${type}` : `Edit ${type}`) : title
    
      return <Component {...props} title={formTitle} />;
    };
    return (
        type == 'settingsPage' ? (
            <SettingsForm toggleForm={handleFormType} title="Settings" setFormObj={handleFormType}/>
        ) : 
        getFormComponent(type, id, commonProps)
  )}
  
  export default FormContainer;
  