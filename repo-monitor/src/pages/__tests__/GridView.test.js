import {render, getByText, act} from '@testing-library/react'
import GridView from "../GridView"
import { BrowserRouter, Routes, Route } from "react-router-dom";


describe('GridView', () => {
    it('grid empty text should show on initial render of empty grid', () => {
        act(() => {
            render(
                <BrowserRouter>
                    <Routes>   
                        <Route path="*" element= {<GridView/>}/>
                    </Routes>
                </BrowserRouter>
            )
        })
        
        const elt = <h5>Add repositories by searching!</h5>
        expect(elt).toBeInTheDocument
    })
})