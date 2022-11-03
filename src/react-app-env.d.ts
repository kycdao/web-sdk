/// <reference types="react-scripts" />
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider
    }
    // eslint-disable-next-line no-var
    function BootstrapKycDaoModal(elementSelector: string | HTMLElement, height: number | string, width: number | string,
        demoMode: boolean,
        enabledBlockchainNetworks: SdkConfiguration["enabledBlockchainNetworks"],
        enabledVerificationTypes: SdkConfiguration["enabledVerificationTypes"],
        messageTargetOrigin?: string): void
    function KycDaoClient(KycDaoClientOptions)
}
