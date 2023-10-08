import ButtonPath from '@/blocks/Button/ButtonPath';
import classNames from 'classnames';
import KreatorCard from '../blocks/Card/KreatorCard';
import { Pill__Logo } from '../blocks/Pills';
import SliderList from '../blocks/SliderList';
import SectionTitle from '../blocks/Title/SectionTitle';
import Row from './Row';


import { connect } from 'react-redux';

import translations from '@/constants/translations';

const breakPoints = {
    default: { width: 320, slides: 2 },
    sm: { width: 640, slides: 2 },
    md: { width: 768, slides: 4 },
    lg: { width: 1024, slides: 4 },
    xl: { width: 1280, slides: 4 }
};

const kreators = [
    // {
    //     image: 'https://ucarecdn.com/63b5348c-5e07-4c57-a034-0be1cd29244c/-/preview/400x400/',
    //     name: 'Maria Ronning',

    //     link: '/experiences/user/mariaronnn/all'
    // },
    {
        image: 'https://ucarecdn.com/93c48b02-35ff-4943-9761-4b353842bc54/-/preview/400x400/',
        name: 'Turki Shoaib',
        link: '/experiences/user/arabiantrails/all'
    },
    {
        image: 'https://ucarecdn.com/1cf94ab3-9c9c-47ae-a3b9-f7e28d7ebed7/-/preview/400x400/',
        name: 'Leslie Leroy',
        link: '/experiences/user/leslie_leroy/all'
    },
    {
        image: 'https://ucarecdn.com/4926ff85-7ca0-4a55-915a-8baf6363d554/-/preview/400x400/',
        name: 'Jason Bilam',
        link: '/experiences/user/jasonbillamtravel/all'
    }
];

const Community = ({ dataLoading = false, globalState: {lang}}) => {
    return (
        <div className="w-full py-0 bg-black relative">
            <div className="absolute inset-0 bg-black overflow-hidden">
                <img
                    src={
                        'https://ucarecdn.com/03eebdef-9731-4d9b-910a-c163c4edf315/'
                    }
                    //  src={`${data.image}-/preview/300x300/`} h-full blur-2xl
                    className={`object-cover w-full transform scale-150 opacity-50a opacity-40`}
                />
            </div>
            <Row>
                <div
                    className={`relative bg-contain bg-no-repeat bg-center pt-8 pb-16 md:pt-12 lg:pt-16 xl:pt-24  lg:pb-12 d-hdpi-2:pt-vw-24 d-hdpi-2:pb-vw-12 `}>
                    <div className="flex flex-col-reverse items-center lg:items-start lg:flex-row justify-center gap-4 lg:gap-16 ">
                        <div className="lg:w-screen-3/7 flex flex-col px-8 md:px-0">
                            <SectionTitle
                                titleColor="text-green-400"
                                subtitleColor="text-white"
                                section={{
                                    title: translations[lang].meetOurKreators
                                }}
                                className="flex justify-center"
                                padding=""
                                // size="text-4xl md:text-5xl"
                                titlePadding="pb-1"
                            />
                            <div className="flex justify-center text-2xl md:text-2xl xl:text-2xl d-hdpi-2:text-vw-2xl tracking-tight text-white font-semibold leading-tight mb-4 d-hdpi-2:mb-vw-4">
                                { translations[lang].realPeopleBehind }
                            </div>
                            <div className="text-center text-white text-opacity-75 text-base md:text-lg xl:text-xl d-hdpi-2:text-vw-xl font-normal mb-8 d-hdpi-2:mb-vw-8">
                            { translations[lang].realPeopleBehindIntro } {' '}
                                {/* <a
                                    className="text-green-400 font-bold"
                                    href="https://www.instagram.com/mariaronnn/">
                                    Maria
                                </a>
                                ,{' '} */}
                                <a
                                    className="text-green-400 font-bold"
                                    href="https://www.instagram.com/arabiantrails">
                                    Turki
                                </a>
                                ,{' '}
                                <a
                                    className="text-green-400 font-bold"
                                    href="http://instagram.com/jasonbillamtravel">
                                    Leslie
                                </a>
                                , and{' '}
                                <a
                                    className="text-green-400 font-bold"
                                    href="http://instagram.com/jasonbillamtravel">
                                    Jason
                                </a>{' '}
                                {translations[lang].realPeopleBehindIntro2}
                            </div>
                            <div className="flex justify-center">
                            <ButtonPath
                                shadow=""
                                dark
                                url="https://kreator.viakonnect.com/c"
                                width="md:w-72 d-hdpi-2:w-vw-72"
                                label={translations[lang].menu.becomeKreator.title}
                                className="text-center"
                                sameWindow
                            />
                            </div>
                        </div>
                    </div>
                </div>
            </Row>
        </div>
    );
};

const mapStateToProps = (state) => ({ globalState: state.globalState });

export default connect(mapStateToProps)(Community);