import { FC, useContext, useCallback, useEffect } from "react"
import { DataActionTypes, HeaderButtons, OnNext, OnPrev, StateContext, StepID } from "../components/stateContext"
import { Step } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { PageProps } from "./pageProps"

export const KycDAOMembershipStep: FC<PageProps> = ({ className, animation, disabled = false, inactive = false }) => {
    const { dispatch } = useContext(StateContext)

    useEffect(() => {
        if (!disabled && !inactive) {
            const prev = OnPrev.subscribe(() => {
                dispatch({ payload: { current: StepID.AgreementStep, next: StepID.kycDAOMembershipStep }, type: DataActionTypes.changePage })
            })
            return prev.unsubscribe.bind(prev)
        }
    }, [disabled])

    const onSubmit = useCallback(() => {
        dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.verificationStep, prev: StepID.kycDAOMembershipStep } })
        dispatch({ type: DataActionTypes.termsAcceptedChange, payload: true })
    }, [])

    useEffect(() => {
        if (!disabled && !inactive) {
            const next = OnNext.subscribe(onSubmit)
            return next.unsubscribe.bind(next)
        }
    }, [disabled])

    const onTransitionDone = useCallback(() => {
        if (!disabled && !inactive) {
            dispatch({ payload: { button: HeaderButtons.prev, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
        }
    }, [disabled, inactive])

    return <Step inactive={inactive}
        onTransitionDone={onTransitionDone}
        disabled={disabled}
        animation={animation}
        className={className}
        onEnter={onSubmit}
        footer={({ disabled, inactive }) =>
            <>
                <div className="policy">By starting verification you accept <a href="#">Privacy Policy</a> and <a href="#">Terms &#38; Conditions.</a></div>
                <SubmitButton autoFocus={!inactive && !disabled} disabled={disabled} inactive={inactive} className="full-width blue" onClick={onSubmit} />
            </>
        }>
        <h1 className="h1">01 - KycDAO Membership</h1>
        <p className="p">kycDAO is building a trusted web3 ecosystem linked together by verified wallets.</p>
        <p className="p">Once verified and proof is minted on-chain, all kycDAO partner services will accept the verification.</p>
        <div className="the-process">
            <ul>
                <li>
                    <span>1</span>
                    <p>Connect</p>
                </li>
                <li>
                    <span>2</span>
                    <p>Verify</p>
                </li>
                <li>
                    <span>3</span>
                    <p>Mint</p>
                </li>
            </ul>

        </div>
    </Step>
}