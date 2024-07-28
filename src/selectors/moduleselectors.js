import { selectn } from "../utils/utils";

export const getDepartments = (state)=> selectn(`modules.departments`,state) || {};
export const getDeptArr = (state) => Object.values(selectn(`modules.departments`,state) || {})


export const getUsers = (state)=> selectn(`modules.users`,state) || {};
export const getUsersArr = (state) => Object.values(selectn(`modules.users`,state) || {})



export const getProfiles = (state)=> selectn(`modules.profiles`,state) || {};
export const getProfilesArr = (state) => Object.values(selectn(`modules.profiles`,state) || {})