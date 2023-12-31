import AuthLogin from '@/components/auth/AuthLogin';
import ModalGeneric from './ModalGeneric';
import { toggleAuthModal, setAuthPage } from '@/store/actions/globalState';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthRegister from '@/components/auth/AuthRegister';
import AuthProfile from '@/components/auth/AuthProfile';
import AuthAccountReset from '@/components/auth/AuthAccountReset';


const ModalAuth = ({
    auth,
    toggleAuthModal,
    setAuthPage,
    globalState: { authModalIsOpen, authComponent }
}) => {
    return (
        authModalIsOpen && (
            <ModalGeneric
                setModalIsOpen={toggleAuthModal}
                close
                size="md:max-w-xl md:w-full xl:h-auto d-hdpi-2:max-w-screen-1/3"
                auth={auth}>
                {authComponent === 'login' && <AuthLogin FlashSocial={false} />}
                {authComponent === 'loginFlashSocial' && <AuthLogin FlashSocial={true} />}
                {authComponent === 'register' && <AuthRegister />}
                {authComponent === 'profile' && <AuthProfile />}
                {authComponent === 'reset' && <AuthAccountReset />}
            </ModalGeneric>
        )
    );
};

const mapStateToProps = (state) => ({
    globalState: state.globalState,
    auth: state.auth
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            toggleAuthModal,
            setAuthPage
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalAuth);
