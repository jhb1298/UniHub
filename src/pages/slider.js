import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import '../css/DoubleEndedSlider.css';

const DoubleEndedSlider = ({onChange}) => {
  const [values, setValues] = useState([2000, 2024]);
  const min=2000
  const max=new Date().getFullYear()

  useEffect(()=>{
    onChange(values);
  },[values,onChange])

  return (
    <div className=" w-full">
      <ReactSlider
        className="w-full h-2 flex items-center"
        thumbClassName="thumb "
        trackClassName="track"
        value={values}
        min={min}
        max={max}
        step={1}
        onChange={(newValues) => setValues(newValues)}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
      />
      <div className="slider-values">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default DoubleEndedSlider;
