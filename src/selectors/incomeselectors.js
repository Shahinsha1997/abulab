import { createSelector } from 'reselect';
import { fieldFilterArr, getDrNameList } from '../utils/utils';


const getDatas = state=> state.data;
async function foundDuplicates(datas){
    const values = Object.values(datas);
    const duplicateObj = [];
    const ids = [];
    const timeStamp = [];
    const duplicateIds = [];
    values.map(record=>{
        const { patientId, time } = record;
        if(patientId == ''){
            return;
        }
        if(!ids.includes(patientId)){
            ids.push(patientId)
        }else{
            duplicateObj.push(record);
            duplicateIds.push(patientId);
        }
        if(!timeStamp.includes(time)){
            timeStamp.push(time)
        }else{
            duplicateObj.push(record);
            duplicateIds.push(time);
        }
    });
    // console.log(duplicateIds);
    // console.log(duplicateObj);
    const duplicateAllObj = []
    values.map(record=>{
        const { patientId, time } = record;
        if(duplicateIds.includes(time) || duplicateIds.includes(patientId)){
            duplicateAllObj.push(record)
        }
    })
    duplicateAllObj.sort((a,b)=>a.patientId - b.patientId)
    console.log("Duplicates",duplicateAllObj)
}
export const getDataIds = createSelector(
    getDatas,
    (datas)=>{
        const keys = Object.keys(datas);
        const sortedKeys = keys.sort(function(a, b){return datas[b].time-datas[a].time});
        const filteredByStatus = fieldFilterArr(sortedKeys,datas,'status');
        const filteredByDrName = fieldFilterArr(sortedKeys,datas,'drName')
        const drNamesList = getDrNameList(datas,sortedKeys)
        foundDuplicates(datas);
        return { 
            dataIds: sortedKeys, 
            filteredByDrName, 
            filteredByStatus, 
            datas, 
            drNamesList
        }
    }
)
