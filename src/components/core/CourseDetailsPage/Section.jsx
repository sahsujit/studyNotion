import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubSection from './SubSection';
import { useState,useEffect } from 'react';

const Section = ({section,collapse,setCollapse}) => {
    const [expanded, setExpanded] = useState(false);
    useEffect(()=>{
        if(collapse===true)
        setExpanded(false)
    },[collapse])
  return (
    <div className='border border-richblack-600'>
        <Accordion  
        expanded={expanded} onChange={(event, isExpanded) =>{ 
            if(isExpanded===true && collapse===true)
            setCollapse(false)
          
            setExpanded(isExpanded)}}
        >
            
            <AccordionSummary
            sx={{bgcolor : "#2C333F",
            fontSize : "16px",
            color : "#F1F2FF",
            borderBottom : "1px",
            borderColor : "#424854",
            fontWeight : 500,
            }} expandIcon={<ExpandMoreIcon htmlColor={'#999DAA'}/>}  >
               <div className='flex flex-row justify-between w-full mr-4'>
              <p>{section.sectionName}</p>
              <p className='text-yellow-50'>{section.subSection.length}{" "} {section.subSection.length<=1 ? "lecture" : "lectures"}</p>
               </div>
            </AccordionSummary>
            <AccordionDetails sx={{bgcolor : "#000814",
        padding : '8px'}}>
                {
                    section.subSection.map((subSection)=>{
                        return <SubSection subSection={subSection} collapse={collapse} setCollapse={setCollapse}></SubSection>
                    })
                }
            </AccordionDetails>
        </Accordion>
    </div>
  )
}

export default Section