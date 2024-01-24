import { useState, useEffect } from 'react';
import YesSvg from '../assets/Yes.svg';
import NoSvg from '../assets/No.svg';
import AbstainSvg from '../assets/Abstain.svg';

export default function UserComponent({ decision, name }) {

    return (
        <div className='w-full  bg-[#fff]'>

            {
                decision === 0 &&
                <div className='flex flex-row items-center'>
                    <div className='w-[60px] h-[60px]'>
                        <img src={NoSvg} />
                    </div>
                    <div className='text-[700] text-[16px] ml-2'>
                        {name}
                    </div>
                </div>
            }

            {
                decision === 1 &&
                <div className='flex flex-row items-center'>
                    <div className='w-[60px] h-[60px]'>
                        <img src={YesSvg} />
                    </div>
                    <div className='text-[700] text-[16px] ml-2'>
                        {name}
                    </div>
                </div>
            }

            {
                decision === 2 &&
                <div className='flex flex-row items-center'>
                    <div className='w-[60px] h-[60px]'>
                        <img src={AbstainSvg} />
                    </div>
                    <div className='text-[700] text-[16px] ml-2'>
                        {name}
                    </div>
                </div>
            }
            {
                decision === 3 &&
                <div className='flex flex-row items-center'>
                    <div className=' w-[60px] h-[60px] p-[8px]'>
                        <div className='  w-[45px] h-[45px]  rounded-full bg-[#D9D9D9] border-[2px] border-[#5B5B5B] '>
                        </div>
                    </div>
                    <div className='text-[700] text-[16px] ml-2'>
                        {name}
                    </div>
                </div>

            }
        </div>
    )
}