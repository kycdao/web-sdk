import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { KycDaoContext } from "../components/kycDao.provider"
import { StateContext, DataActionTypes, StepID, HeaderButtons, OnNext, OnPrev } from "../components/stateContext"
import { Step, StepAnimation } from "../components/step/step"
import { SubmitButton } from "../components/submitButton/submitButton"
import { ToggleButton } from "../components/toggleButton/toggleButton"

type Chains = 'Near' | 'Ethereum'

export const ChainSelection: FC<{ className?: string, animation?: StepAnimation, disabled?: boolean }> = ({ className, animation, disabled = false }) => {
    const kycDao = useContext(KycDaoContext)
    const [connectedWallet, setConnectedWallet] = useState<"Near" | "Ethereum">()

    const { dispatch } = useContext(StateContext)

    const chains = useMemo<{ value: Chains, label: string, isAvailable: boolean }[]>(() => [
        { label: 'NEAR', value: 'Near', isAvailable: true },
        { label: 'EVM', value: 'Ethereum', isAvailable: true }
    ], [kycDao])

    const onChange = useCallback((value: Chains) => async () => {
        kycDao?.kycDao.connectWallet(value).then(() => {
            setConnectedWallet(value)
            dispatch({ payload: { button: HeaderButtons.next, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
        })
    }, [])

    useEffect(() => {
        const next = OnNext.subscribe(onSubmit)
        return next.unsubscribe.bind(next)
    }, [])

    useEffect(() => {
        if (!disabled) {
            const prev = OnPrev.subscribe(() => {
                dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.taxResidenceStep, next: StepID.chainSelection } })
            })

            return prev.unsubscribe.bind(prev)
        }
    }, [disabled])

    const onSubmit = useCallback(async () => {
        if (connectedWallet) {
            try {
                await kycDao?.kycDao.registerOrLogin()
            } catch (err) {
                console.error(err)
            }
            dispatch({ type: DataActionTypes.changePage, payload: { current: StepID.beginVerificationStep, prev: StepID.chainSelection } })
        }
    }, [connectedWallet])

    const onTransitionDone = () => {
        if (!disabled) {
            dispatch({ payload: { button: HeaderButtons.prev, state: 'enabled' }, type: DataActionTypes.SetHeaderButtonState })
            dispatch({ payload: { button: HeaderButtons.next, state: 'hidden' }, type: DataActionTypes.SetHeaderButtonState })
        }
    }

    if (!kycDao) {
        return <>Error</>
    }

    return <Step
        onTransitionDone={onTransitionDone}
        disabled={disabled}
        animation={animation}
        className={className}
        onEnter={onSubmit}
        header={() => <h1 className="h1">Mint</h1>} 
        footer={(disabled, transitionDone) => <>
            <SubmitButton autoFocus={!!connectedWallet && transitionDone} disabled={!connectedWallet || disabled || !transitionDone} className="full-width blue" onClick={onSubmit} />
        </>} >
        <h2 className="h2">
            Your amazing NFT image will be here, but first, please complete KYC verification!
        </h2>
        <h2 className="h2">
            Select Network
        </h2>
        {chains.filter(chain => chain.isAvailable).map(({ label, value }) =>
            <ToggleButton label={label} toggle={value === connectedWallet} key={value} className="full-width blue" onClick={onChange(value)} />
        )}
    </Step>
}