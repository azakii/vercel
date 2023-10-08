import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import router, { useRouter } from 'next/router';
import Layout from '@/layouts/Layout';
import GridList from '@/sections/GridList';
import translations from '@/constants/translations';
import { countriesArray } from '@/helpers/countriesArray';
import ListBoxGeneric from '@/components/blocks/ListBoxGeneric';
import ExperienceFilter from '@/blocks/ExperienceFilter';
import LoadMore from '@/blocks/LoadMore';
import { NEXT_PUBLIC_ITEMS_PER_PAGE } from '@/constants/public';
import { pageCount } from '@/helpers/FEutils';
import SliderDestinations from '@/components/sections/SliderDestinations';
// import { getLandingPage } from '@/helpers/apiServices/experiences';
import Row from '@/components/sections/Row';
import GenericSelectList from '@/components/blocks/GenericSelectList';
import SkeletonText from '@/components/blocks/Card/SkeletonText';
import SliderInterests from '@/components/sections/SliderInterests';
import { toggleCountryList } from '@/store/actions/globalState';

// import CountryList from '@/components/blocks/CountryList';

const LandingPage = ({
    toggleCountryList,
    globalState: {
        countryListIsOpen,
        lang,
        siteData: { destinationList = [], categories = [] }
    }
    // landingData
}) => {
    // const dataLanding = JSON.parse(landingData);
    const accepedTypes = ['all', 'digital', 'guided'];
    const { query, isReady } = useRouter();
    const [dataLoading, setDataLoading] = useState(true);
    const [loadMoreData, setLoadMoreData] = useState(false);
    const [expList, setExpList] = useState([]);
    const [countrySelectList, setCountrySelectList] = useState([]);
    const [selectedDate, setSelectedDate] = useState({});
    const currentPage = useRef(1);
    const totalPages = useRef(1);
    const totalCount = useRef(0);
    const filterType = useRef('all');
    const findParams = useRef([]);

    const [pageIsReady, setPageIsReady] = useState(false);

    const getExps = async (countryIds, type, page = 1) => {
        let response;
        if (countryIds === 'WORLD')
            response = await fetch(
                `/api/search/${type}?limit=${NEXT_PUBLIC_ITEMS_PER_PAGE}&page=${page}`
            );
        else
            response = await fetch(
                `/api/destinations/${countryIds}/${type}?limit=${NEXT_PUBLIC_ITEMS_PER_PAGE}&page=${page}`
            );
        const data = await response.json();

        return data;
    };
    const countrySelect = (code) => {
        if (pillCountryList.find((item) => item === 'WORLD')) {
            setPillCountryList([code]);
        } else {
            setPillCountryList((prev) => [...prev, code]);
        }
    };

    const loadExperiences = (countryIds, type, page = 1) => {
        getExps(countryIds, type, page).then((data) => {
            const { count, page, pages, results } = data;

            currentPage.current = page;
            totalPages.current = pageCount(count, NEXT_PUBLIC_ITEMS_PER_PAGE);
            totalCount.current = count;

            setExpList([...expList, ...results]);
            setDataLoading(false);
            setLoadMoreData(false);
        });
    };
    const handleLoadClick = () => {
        setLoadMoreData(true);
        loadExperiences(
            findParams.current,
            filterType.current,
            currentPage.current + 1
        );
    };
    const [pillCountryList, setPillCountryList] = useState([]);
    const pillListLength = useRef(0);

    useEffect(() => {
        if (pillListLength.current !== pillCountryList?.length) {
            const slugList = pillCountryList
                .map((countryCode) => {
                    return countriesArray.find(
                        (item) => item.code === countryCode
                    ).slug;
                })
                .join('+');
            router.push(
                `${slugList.length > 0 ? slugList : 'world'}/${
                    filterType.current
                }`
            );
        } else {
            let slug;
            if (
                findParams.current === 'WORLD' &&
                pillCountryList.length === 1 &&
                pillCountryList[0] !== 'WORLD'
            ) {
                slug =
                    countriesArray.find(
                        (item) => item.code === pillCountryList[0]
                    )?.slug ?? 'world';
                router.push(`${slug}/${filterType.current}`);
            }
        }
    }, [pillCountryList]);

    const handleRemove = (pill) => {
        setPillCountryList(pillCountryList.filter((item) => item !== pill));
    };

    const toggleExpand = () => {
        toggleCountryList(!countryListIsOpen);
    };

    useEffect(() => {
        if (isReady) {
            let found = destinationList.find(
                (element) =>
                    element.slug.toLowerCase() == query.id[0].toLowerCase()
            );
            setSelectedDate(countrySelectList[0]);

            if (destinationList.length) {
                if (!found) {
                    const slugList = query.id[0].toLowerCase().split('+');

                    findParams.current = slugList
                        .reduce((last, next) => {
                            const finded = countriesArray.find(
                                (element) => element.slug.toLowerCase() === next
                            );
                            if (finded) {
                                return [...last, finded.code];
                            } else {
                                return last;
                            }
                        }, [])
                        .join('-');

                    if (!findParams.current.length) {
                        findParams.current = 'WORLD';
                    }
                } else {
                    toggleCountryList(false);
                    findParams.current = found.country_list.join('-');
                }
                setCountrySelectList(() => {
                        return countriesArray.map((country) => {
                                    const { code: id, name, slug } = country;
                        
                                    return {
                                        id,
                                        name,
                                        slug,
                                        unavailable: false
                                    };
                                }).filter(c => !findParams.current.split('-').includes(c.id));
                    })
                if (query.id.length > 1) {
                    filterType.current = accepedTypes.includes(
                        query.id[1].toLowerCase()
                    )
                        ? query.id[1].toLowerCase()
                        : 'all';
                }

                if (findParams.current.length) {
                    loadExperiences(findParams.current, filterType.current);
                    const splitList = findParams.current.split('-');
                    setPillCountryList(splitList);
                    pillListLength.current = splitList.length;
                }
            }
            setPageIsReady(true);
        }
    }, [destinationList]);

    return (
        <Layout>
            <Row>
                <SliderDestinations
                    margins="mt-12 d-hdpi-2:mt-vw-12"
                    sectionTitles={
                        translations[lang].sections.wanderByDestination
                    }
                    data={destinationList || []}
                    tagRatio="landscape"
                />
            </Row>

            {pageIsReady && (
                <>
                    <ExperienceFilter
                        query={query}
                        classes="-mt-8 d-hdpi-2:-mt-4"
                    />

                    <Row>
                        <div className="px-4 d-hdpi-2:px-vw-4">
                            <div className="flex flex-col gap-2 d-hdpi-2:gap-1 border-t pt-4 d-hdpi-2:pt-vw-4 pb-8 d-hdpi-2:pb-vw-8 border-gray-300">
                                {!dataLoading ? (
                                    <>
                                        <div className="text-3xl d-hdpi-2:text-vw-3xl tracking-tighter font-bold text-kn-primary">
                                            {findParams.current === 'WORLD'
                                                ? 'The World'
                                                : destinationList.find(
                                                        (item) =>
                                                            item.slug ===
                                                                query.id[0].toLowerCase()
                                                    )?.name}
                                        </div>
                                        <div className="flex flex-wrap gap-2 d-hdpi-2:gap-1">
                                            {totalCount.current > 0 ? (
                                                <>
                                                    <span className="text-xl d-hdpi-2:text-vw-xl font-light text-gray-700 tracking-tight">
                                                        We found
                                                    </span>
                                                    <span className="text-xl d-hdpi-2:text-vw-xl font-semibold text-gray-700 tracking-tight">
                                                        {`${
                                                            totalCount.current
                                                        } ${
                                                            totalCount.current >
                                                            1
                                                                ? 'Experiences'
                                                                : 'Experience'
                                                        }`}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-xl d-hdpi-2:text-vw-xl font-light text-gray-700 tracking-tight">
                                                    We couldn't find any
                                                    experiences matching your
                                                    criteria
                                                </span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex pt-2 mb-2 d-hdpi-2:pt-vw-2 d-hdpi-2:mb-vw-2">
                                            <SkeletonText
                                                height="h-6 d-hdpi-2:h-vw-6"
                                                width="w-36 d-hdpi-2:w-vw-36"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 d-hdpi-2:gap-1 d-hdpi-2:pt-vw-2">
                                            <SkeletonText
                                                height="h-4 d-hdpi-2:h-vw-4"
                                                width="w-20 d-hdpi-2:w-vw-20"
                                            />
                                            <SkeletonText
                                                height="h-4 d-hdpi-2:h-vw-4"
                                                width="w-36 d-hdpi-2:w-vw-36"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Row>

                    <Row>
                        <div className="flex flex-col md:flex-row md:items-centera gap-4 px-4 d-hdpi-2:gap-2 d-hdpi-2:px-vw-4">
                            <div className="w-80 d-hdpi-2:w-vw-80 pb-2 md:pb-8 flex-none d-hdpi-2:pb-vw-8">
                                <GenericSelectList
                                    selectOptions={countrySelectList}
                                    handleChange={countrySelect}
                                    keys={{
                                        id: 'id',
                                        label: 'name'
                                    }}
                                    selectedValue={'novalue'}
                                    isLoading={dataLoading}
                                    placeholder="Add a Destination"
                                    menuTextSize="1rem"
                                    labelTextSize="1rem"
                                    bgColor="#FFFFFF"
                                    height="2rem"
                                />
                            </div>
                            {countryListIsOpen === true ||
                            pillCountryList.length < 10 ? (
                                <div className="flex flex-wrap gap-2 d-hdpi-2:gap-1 md:px-4 pb-8  items-center d-hdpi-2:pxvw-4 d-hdpi-2:pb-vw-8">
                                    {pillCountryList.length >= 10 && (
                                        <button
                                            onClick={toggleExpand}
                                            className="pr-4 pl-3 d-hdpi-2:pr-vw-4 d-hdpi-2:pl-vw-3 text-green-900 text-sm d-hdpi-2:text-vw-sm bg-green-400 py-1 d-hdpi-2:py-vw-1 rounded-full flex items-center gap-2 d-hdpi-2:gap-1 hover:bg-gray-900 hover:text-white">
                                            <i className="ri-arrow-left-s-line"></i>
                                            <span>Collapse country List</span>
                                        </button>
                                    )}
                                    {!pillCountryList.find(
                                        (item) => item === 'WORLD'
                                    ) &&
                                        pillCountryList.map((pill) => (
                                            <button
                                                onClick={() =>
                                                    handleRemove(pill)
                                                }
                                                className="pl-4 pr-3 d-hdpi-2:pl-vw-4 d-hdpi-2:pr-vw-3 text-green-900 text-sm d-hdpi-2:text-vw-sm bg-green-100 py-1 d-hdpi-2:py-vw-1 rounded-full flex items-center gap-2 d-hdpi-2:gap-1 hover:bg-gray-900 hover:text-white">
                                                <span>
                                                    {
                                                        countriesArray.find(
                                                            (item) =>
                                                                item.code ===
                                                                pill
                                                        ).name
                                                    }
                                                </span>
                                                <i className="ri-close-line"></i>
                                            </button>
                                        ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 d-hdpi-2:gap-1 md:px-4 pb-8 d-hdpi-2:px-vw-4 d-hdpi-2:pb-vw-8 items-center">
                                    <button
                                        onClick={toggleExpand}
                                        className="pl-4 pr-3 d-hdpi-2:pl-vw-4 d-hdpi-2:pr-vw-3 text-green-900 text-sm d-hdpi-2:text-vw-sm bg-green-400 py-1 d-hdpi-2:py-vw-1 rounded-full flex items-center gap-2 d-hdpi-2:gap-1 hover:bg-gray-900 hover:text-white">
                                        <span>Expand country List</span>
                                        <i className="ri-arrow-right-s-line"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </Row>
                    <GridList
                        data={expList}
                        btnLabel="Load More"
                        btnAction="load"
                        btnUrl="/experiences/search"
                        dataLoading={dataLoading}
                        loadMoreData={loadMoreData}
                        handleLoadClick={handleLoadClick}
                        showButton={
                            currentPage.current !== totalPages.current ||
                            loadMoreData
                        }
                    />
                    <Row>
                        <SliderInterests
                            margins="mt-12 d-hdpi-2:mt-vw-12"
                            sectionTitles={
                                translations[lang].sections.wanderByInterest
                            }
                            data={categories || []}
                            path={'/experiences/interest/'}
                            tagRatio="landscape"
                        />
                    </Row>
                </>
            )}
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    globalState: state.globalState,
    auth: state.auth
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleCountryList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);

// export async function getServerSideProps({ params }) {
//     let landingData = null;

//     try {
//         landingData = await getLandingPage();
//     } catch (error) {
//         return {
//             props: {},
//             notFound: true
//         };
//     }

//     return {
//         props: {
//             landingData: JSON.stringify(landingData?.data)
//         }
//     };
// }
