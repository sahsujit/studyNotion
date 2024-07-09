import React, { useEffect } from 'react'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import { RiComputerLine } from "react-icons/ri";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
const SubSection = ({subSection,collapse,setCollapse}) => {
    const [expanded, setExpanded] = useState(false);
    useEffect(()=>{
        if(collapse===true)
        setExpanded(false)
    },[collapse])
  return (
    <Accordion  expanded={expanded} onChange={(event, isExpanded) =>{ 
        if(isExpanded===true && collapse===true)
        setCollapse(false)
        setExpanded(isExpanded)}} >
         <AccordionSummary
            sx={{bgcolor : '#000814',
            fontSize : "16px",
            color : "#F1F2FF",
            fontWeight : 500,
            }} expandIcon={<ExpandMoreIcon htmlColor={'#999DAA'}/>}  >
               <div className='flex flex-row items-center space-x-2'>
                <RiComputerLine size={20}/>
                <p>{subSection.title}</p>
               </div>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "#000814",
        padding : '8px'}}>
              <p className='text-richblack-50 px-8 text-[16px] '>{subSection.description}</p>
            </AccordionDetails>
    </Accordion>
  )
}

export default SubSection