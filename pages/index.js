import Layout from '@/layouts/Layout';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SwellController } from '@/swell/api/swellNode';
import Showcase from '@/sections/Showcase';
import SliderExperiences from '@/components/sections/SliderExperiences';
import SliderInterests from '@/sections/SliderInterests';
import SliderDestinations from '@/sections/SliderDestinations';
import SliderCollections from '@/sections/SliderCollections';
import GridList from '@/sections/GridList';
import translations from '@/constants/translations';
import { getLandingPage } from '@/helpers/apiServices/experiences';
import { randomItem } from '@/helpers/FEutils';
import {
    NEXT_PUBLIC_LATEST_PER_PAGE,
    NEXT_PUBLIC_TRENDING_PER_PAGE
} from '@/constants/public';
import Row from '@/components/sections/Row';
import Community from '@/components/sections/Community';
import HowItWorks from '@/components/sections/HowItWorks';
import SliderShowcases from '@/components/sections/SliderShowcases';
import useWindowSize from '@/hooks/useWindowSize';
import { getTrendingGridColumns } from '@/helpers/responsive';
import CallToAction from '@/components/sections/CallToAction';

const randomize = process.env.RANDOMIZE_RESULTS || 'true';

const LandingPage = ({
    globalState: {
        lang,
        siteData: { destinationList, categories }
    },
    latest: { results: latestList },
    landingData,

    // trending: { results: trendingList }
    promoted
}) => {
    const dataLanding = JSON.parse(landingData);
    const [randomCover, setRandomCover] = useState(
        randomItem(dataLanding?.data?.landing)
    );

    const windowSize = useWindowSize();

    return (
        <Layout>
            <Showcase
                pill="bottom"
                data={randomCover}
                collection="showcase"
                darkenMobile
                dataFeatures={dataLanding?.data?.features}
            />

            <GridList
                sectionTitles={translations[lang].sections.trendingThisWeek}
                // data={trendingList}
                data={promoted}
                btnLabel="Explore all experiences"
                btnPos="side"
                btnAction="url"
                btnUrl="/experiences/destination/world/all"
                margins="mt-16 mb-8 lg:mt-12 lg:mb-12 d-hdpi-2:mt-vw-12 d-hdpi-2:mb-vw-12"
                titleClass=""
                filteredCount={getTrendingGridColumns(windowSize.width)}
                randomize={randomize}
            />
            <HowItWorks />
            <div className="bg-green-500/5 pb-8 md:pb-16 pt-16 md:pt-16 px-0 lg:px-8">
            <Row>
                <div className="">
                    <SliderDestinations
                        world={false}
                        sectionTitles={
                            translations[lang].sections.wanderByDestination
                        }
                        data={destinationList || []}
                        tagRatio="portrait2"
                        margins="mt-8 mb-4 lg:mt-12 lg:mb-8 xl:mb-16 d-hdpi-2:mt-vw-12 d-hdpi-2:mb-vw-16"
                        absoluteButtons={true}
                    />
                </div>
            </Row>
            </div>
            {/* <Row>
                    <div className="px-4">
                        <SliderExperiences
                            sectionTitles={
                                translations[lang].sections.newThisMonth
                            }
                            latestList={latestList}
                        />
                    </div>
                </Row> */}
            {/* <Row>
                    <div className="px-4">
                        <SliderInterests
                            sectionTitles={
                                translations[lang].sections.wanderByInterest
                            }
                            data={categories || []}
                            path={'/experiences/interest/'}
                            world={false}
                        />
                    </div>
                </Row> */}

            {/* <Showcase
                pill="top"
                data={randomItem(dataLanding?.data?.features)}
            /> */}

            <Community />
            <CallToAction />

            {/* <SliderCollections
                    sectionTitles={translations[lang].sections.curatedCollections}
                    data={dataLanding?.data?.curated || []}
                    boxed
                /> */}
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    globalState: state.globalState,
    auth: state.auth
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);

export async function getStaticProps({ params }) {
    let latest = null;
    let landingData = null;
    // let trending = null;
    let promoted = null;

    try {
        latest = await SwellController.getLatestExperiences(
            NEXT_PUBLIC_LATEST_PER_PAGE
        );
        // trending = await SwellController.trending(
        //     NEXT_PUBLIC_TRENDING_PER_PAGE
        // );
        promoted = await SwellController.promoted();
        landingData = await getLandingPage();
    } catch (error) {
        return {
            props: {},
            notFound: true
        };
    }

    return {
        props: {
            // trending,
            promoted,
            latest,
            landingData: JSON.stringify(landingData?.data)
        },

        revalidate: Number(process.env.NEXT_REVALIDATE_PERIOD_LANDING)
    };
}
