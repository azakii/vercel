import { useEffect, useState, useLayoutEffect } from 'react';
import getMarketingExperience from '@/swell/api/getMarketingExperience';
import { useRouter } from 'next/router';
import Layout from '@/layouts/Layout';
import { Button } from '@/blocks/Button/Buttons';
import ExpSubsection from '@/components/sections/ExpSubsection';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SectionMarketingTitles from '@/components/experiencepage/SectionMarketingTitles';
import SectionMarketingGallery from '@/components/experiencepage/SectionMarketingGallery';
import SectionMarketingIntro from '@/components/experiencepage/SectionMarketingIntro';
import SectionWhatToDo from '@/components/experiencepage/SectionWhatToDo';
import SectionWhereToStay from '@/components/experiencepage/SectionWhereToStay';
import SectionMarketingItinerary from '@/components/experiencepage/SectionMarketingItinerary';
import SectionPricingBooking from '@/components/experiencepage/SectionPricingBooking';
import { NEXT_PUBLIC_DIGITAL_ONLY } from '@/constants/public';
import SectionWhatsIncluded from '@/components/experiencepage/SectionWhatsIncluded';
import SectionPolicies from '@/components/experiencepage/SectionPolicies';
import { NEXT_PUBLIC_SOCIAL_MEDIA } from '@/constants/public';
// import SectionPolicies from '@/components/experiencepage/SectionPolicies';
import debounce from '@/helpers/debounce';
import classNames from 'classnames';
import LayoutLoading from '@/components/layouts/LayoutLoading';
import uiStruct from '@/constants/uiStruct';

// const lang = 'en-US';
const selectedLocale = 'en-US';
const ExperienceDetail = ({
    globalState: { siteData },
    contentfulExperience = {}
}) => {
    const [selectedLang, setSelectedLang] = useState(uiStruct.ui.languages[0]);
    // const [selectedLocale, setSelectedLocale] = useState(uiStruct.ui.languages[0].locale);

    const [scrollPos, setScrollPos] = useState(0);
    const [showCard, setShowCard] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleScroll = () => {
        if (typeof window !== 'undefined') {
            const currentScrollPos = window.scrollY;
            // console.log('direction: ', currentScrollPos - scrollPos);

            // setShowCard(currentScrollPos - scrollPos < 0 || scrollPos > 400);
            setShowCard(scrollPos > 2000);
            setScrollPos(currentScrollPos);
        }
    };

    const [social, setSocial] = useState(null);
    const router = useRouter();
    const { isReady } = useRouter();
    const {
        content_marketing: {
            [selectedLocale]: {
                whereToStay,
                whatToDo,
                gallery,
                intro: { desc },
                policies,
                whatsIncluded
            }
        },
        budgetVisible: { [selectedLocale]: budgetVisible },
        budget_currency: { [selectedLocale]: budget_currency },
        budget_min: { [selectedLocale]: budget_min },
        budget_max: { [selectedLocale]: budget_max },
        title: { [selectedLocale]: title },
        days: { [selectedLocale]: days },
        type: { [selectedLocale]: type },
        bestTimeToGo: { [selectedLocale]: bestTimeToGo },
        destination: { [selectedLocale]: destination },
        accommodation: { [selectedLocale]: accommodation },
        itinerary: { [selectedLocale]: itinerary },
        swellExp: {
            id: swellExpId,
            category_index: { id: categories } = [],
            tags,
            creator,
            content,
            creator: { username, displayname, avatar, bio, first },
            content: {
                destinations,
                experience_id: expId,
                views,
                publish_id: pubId
            }
        }
    } = contentfulExperience;

    const user = {
        username,
        bio,
        displayname,
        profile: {
            avatar,
            first,
            username,
            displayname
        }
    };
    const parseUserData = (userData) => {
        const tmpSocial = {};

        NEXT_PUBLIC_SOCIAL_MEDIA.forEach((sMedia) => {
            if (userData[sMedia]) {
                tmpSocial[sMedia] = userData[sMedia];
                delete userData[sMedia];
            }
        });

        return { ...userData, social: tmpSocial };
    };

    const updateViews = async (swellExpId, views) => {
        const response = await fetch(
            `/api/views/${swellExpId}?views=${views}`,
            {
                method: 'PUT',
                body: [],
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(await response.json());
    };

    useEffect(() => {
        if (isReady) {
            if (NEXT_PUBLIC_DIGITAL_ONLY && type.toLowerCase() === 'guided') {
                router.replace('/');
            } else {
                updateViews(swellExpId, views + 1);
            }

            setSocial(parseUserData(creator).social);
        }
    }, []);
    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 100);

        window.addEventListener('scroll', debouncedHandleScroll);

        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
        };
    }, [scrollPos]);
    //
    return (
        <>
            <Layout>
                {!siteData.loading && !processing && (
                    <div className="overflow-x-hidden md:overflow-x-visible d-hdpi-2:text-vw-base">
                        <SectionMarketingTitles
                            title={title}
                            days={days}
                            tags={tags}
                            categories={categories}
                            destinations={destinations}
                        />
                        <SectionMarketingGallery type={type} images={gallery} />
                        <div
                            className={`mb-12 mt-16 md:mt-16 lg:mt-16 mx-auto px-5 md:px-12 lg:px-12 xl:px-241 2xl:px-401 xl:max-w-7xl d-hdpi-2:max-w-screen-2/3 d-hdpi-2:px-vw-12 d-hdpi-2:mt-vw-16 d-hdpi-2:mb-vw-20 xl:mb-20`}>
                            <main className={` flex items-start`}>
                                <section className="w-full lg:w-4/6 mb-0 d-hdpi-2:mb-0">
                                    <SectionMarketingIntro
                                        type={type}
                                        desc={desc}
                                        budget_max={budget_max}
                                        budget_min={budget_min}
                                        budget_currency={budget_currency}
                                        user={user}
                                        social={social}
                                        bestTimeToGo={bestTimeToGo}
                                        budgetVisible={budgetVisible}
                                    // budget = {}: { isVisible: budgetVisible },
                                    // best_time_to_go = {}: { isVisible: bestTimeToGoVisible },
                                    />

                                    <SectionWhatToDo
                                        destination={destination}
                                        whatToDo={whatToDo}
                                    />
                                    {/* <SectionWhereToStay
                                        whereToStay={whereToStay}
                                        accommodation={accommodation}
                                    /> */}

                                    <SectionMarketingItinerary
                                        type={type}
                                        itinerary={itinerary}
                                    />
                                    {type.toLowerCase() === 'guided' &&
                                        whatsIncluded && (
                                            <SectionWhatsIncluded
                                                data={whatsIncluded}
                                            />
                                        )}
                                    {type.toLowerCase() === 'guided' &&
                                        (policies?.cancellation?.description ||
                                            policies?.refund?.description) && (
                                            <SectionPolicies
                                                dataPolicies={policies}
                                            />
                                        )}
                                </section>

                                <aside className="hidden lg:block lg:w-2/6 sticky top-24 pl-4 lg:pl-8 xl:pl-12 py-4 pb-24 mb-20 d-hdpi-2:pl-vw-12 d-hdpi-2:py-vw-4 d-hdpi-2:pb-vw-24 d-hdpi-2:mb-vw-20">
                                    <SectionPricingBooking
                                        pubId={pubId}
                                        expId={expId}
                                        swellExpId={swellExpId}
                                        type={type}
                                        processing={setProcessing}
                                    />
                                </aside>
                            </main>
                            {type.toLowerCase() === 'guided' && (
                                <ExpSubsection borders="" margins="" padding="">
                                    <div className="text-green-400 inline-flex font-semibold text-2xl d-hdpi-2:text-vw-2xl tracking-tight leading-none flex-shrink-0 flex-initial mb-6 d-hdpi-2:mb-vw-6">
                                        {`Special requirements for Travelers`}
                                    </div>

                                    <div className="flex flex-col items-center md:items-start md:flex-row  justify-between gap-4 d-hdpi-2:gap-2">
                                        <div className="text-gray-800 flex-grow">
                                            If you have any special requests,
                                            please reach out to us via the chat
                                            button on the bottom right.
                                        </div>
                                        {/* <Button
                                            type="outlined"
                                            rounded="lg"
                                            wrapperClasses="w-full md:w-60">
                                            <span className="">
                                                Contact Kreator
                                            </span>
                                        </Button> */}
                                    </div>
                                </ExpSubsection>
                            )}
                            <aside
                                // onClick={() => setShowCard(!showCard)}
                                style={{ zIndex: 300 }}
                                className={classNames(
                                    type.toLowerCase() === 'guided'
                                        ? ' md:w-4/5'
                                        : ' md:w-3/5',
                                    'lg:hidden fixed inset-x-0 md:left-1/2 transition-all duration-300 transform md:-translate-x-1/2 md:inset-x-auto ',
                                    !showCard
                                        ? 'translate-y-full bottom-8'
                                        : 'bottom-0 md:bottom-4'
                                )}>
                                <SectionPricingBooking
                                    pubId={pubId}
                                    expId={expId}
                                    swellExpId={swellExpId}
                                    type={type}
                                    mobile={true}
                                    processing={setProcessing}
                                    handlePanelClick={() =>
                                        setShowCard(!showCard)
                                    }
                                />
                            </aside>
                        </div>
                    </div>
                )}
                {processing ? (
                    <LayoutLoading bg="bg-gray-50">
                        <div className="flex flex-col items-center max-w-2xl text-center mt-6 text-sm d-hdpi-2:text-vw-sm d-hdpi-2:mt-vw-6 d-hdpi-2:max-w-screen-1/3 uppercase tracking-wide text-gray-600">
                            <div>Processing order...</div>
                            <div>
                                Don't close this page. You will be redirected to
                                your purchases page once the processing
                                completes.
                            </div>
                        </div>
                    </LayoutLoading>
                ) : null}
                {/* <div
                    className={` mb-12 mt-24 mx-auto px-5 md:px-9 lg:px-12 xl:px-241 2xl:px-401 xl:max-w-7xl`}>
                    <section className={`px-4`}></section>
                </div> */}
            </Layout>
        </>
    );
};

const mapStateToProps = (state) => ({
    globalState: state.globalState,
    auth: state.auth
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            // toggleAuthModal,
            // setAuthPage
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceDetail);

export async function getStaticProps({ params }) {
    let contentfulExperience = null;

    try {
        contentfulExperience = await getMarketingExperience(
            params?.id ? params?.id.toLowerCase() : ''
        );
        console.log("contentful", contentfulExperience);
    } catch (error) {
        return {
            props: {},
            notFound: true
        };
    }

    return {
        props: {
            contentfulExperience: {
                ...contentfulExperience.fields,
                swellExp: contentfulExperience.swellExp
            }
        },

        revalidate: Number(process.env.NEXT_REVALIDATE_PERIOD)
    };
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking' // true false or 'blocking'
    };
}
