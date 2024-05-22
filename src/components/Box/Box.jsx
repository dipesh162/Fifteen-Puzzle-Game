import React from 'react'
import './Box.css'

function Box({num,handleClick}) {
  return (
    <div id={num.index} onClick={()=>handleClick(num)} className='box' style={{background: num.value === 16 && 'rgba(0, 0, 0, 0.11)'}}>
      {num.value === 16 ? '' : num.value}
    </div>
  )
}

export default Box