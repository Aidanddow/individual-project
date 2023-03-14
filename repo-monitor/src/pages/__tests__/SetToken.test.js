import {render, screen, cleanup, fireEvent, waitFor, act} from '@testing-library/react'
import SetToken from "../SetToken"

describe('SetToken', () => {
    it('error message is hidden upon initial render', async () => {
        render(<SetToken />)
        const error = screen.getByTestId("token-error-text")
        expect(error.classList.contains('hidden')).toBe(true)
        expect(error.classList.contains('error')).toBe(false)
    }),

    it('error message shows when invalid token is entered', async () => {
        render(<SetToken />)

        const input = screen.getByTestId('token-input')
        const button = screen.getByTestId("validate-token-btn")
        const error = screen.getByTestId("token-error-text")

        fireEvent.change(input, {target: {value: 'glpat-2LBxxV7xfWJUKF5aWsNt'}})
        fireEvent.click(button)

        expect(error.classList.contains('error')).toBe(true)
    })
})