import { ring2 } from 'ldrs'


function Spinner({size}){

  ring2.register();
  
  // Default values shown
   return <l-ring-2
    size={size}
    stroke="5"
    stroke-length="0.25"
    bg-opacity="0.1"
    speed="0.8" 
    color="white" 
  ></l-ring-2>
}
export default Spinner