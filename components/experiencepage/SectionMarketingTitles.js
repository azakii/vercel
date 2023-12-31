import { User, Clock, MapPin, Users, Layers } from 'lucide-react';
import { capitalize, getDays, kreatorName } from 'helpers/FEutils';
import { country, findLowestPrice } from 'helpers/LocaleHelper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const SectionMarketingTitles = (props) => {
    const {
        title = '',
        days = 0,
        tags = [],
        categories = [],
        destinations = [],
        globalState: { siteData }
    } = props;

    const cats_list = categories
        .map((cat) => {
            const found = siteData.categories.find((elm) => {
                return elm.swell_id === cat;
            });

            return found?.name;
        })
        .filter((elm) => elm);

    const EmptyData = (
        <span className="w-20 bg-gray-300 rounded-full h-2 d-hdpi-2:w-vw-20 d-hdpi-2:h-vw-2" />
    );
    const ContentDays = days ? <span> {getDays(days)}</span> : EmptyData;

    return (
        <div
            className={`z-100 mb-6 mt-16 mx-auto px-5 md:px-9 lg:px-12 xl:px-241 2xl:px-401 xl:max-w-7xl d-hdpi-2:max-w-screen-2/3 d-hdpi-2:px-vw-12 d-hdpi-2:mt-vw-16 d-hdpi-2:mb-vw6`}>
            <div className={`px-4 d-hdpi-2:px-vw-4`}>
                <div className="inline-flex2 text-transparent bg-clip-text bg-gradient-to-l from-blue-600 via-green-400 to-green-400 font-bold text-3xl d-hdpi-2:text-vw-3xl tracking-tight leading-8 pb-1 flex-shrink-0-a lg:w-max flex-initial-a d-hdpi-2:leading-tight d-hdpi-2:pb-vw-1">
                    {title}
                </div>
                <div className="mt-2 flex flex-wrap items-center font-sans text-sm d-hdpi-2:text-vw-sm d-hdpi-2:mt-vw-2 text-gray-900">
                    <div className="flex  mr-8 py-1 d-hdpi-2:mr-vw-8 d-hdpi-2:py-vw-1">
                        <span className="text-green-400 mr-2 d-hdpi-2:mr-vw-2">
                            <i className="ri-map-pin-line text-xl d-hdpi-2:text-vw-xl"></i>
                        </span>
                        <span className="flex flex-wrap items-center">
                            {destinations?.length > 0 ? (
                                destinations.map((item, index, itemArray) => {
                                    return (
                                        <span key={`${item}_${index}`}>
                                            <span className="whitespace-nowrap">
                                                {item}
                                            </span>
                                            {index < itemArray.length - 1 && (
                                                <span className="px-1 d-hdpi-2:px-vw-1">
                                                    .
                                                </span>
                                            )}
                                        </span>
                                    );
                                })
                            ) : (
                                <span className="w-20 bg-gray-300 rounded-full h-2 d-hdpi-2:w-vw-20 d-hdpi-2:h-vw-2" />
                            )}
                        </span>
                    </div>
                    <div className="flex items-center mr-8 py-1 d-hdpi-2:mr-vw-8 d-hdpi-2:py-vw-1">
                        <span className="text-green-400 mr-2 d-hdpi-2:mr-vw-2">
                            <i className="ri-time-line text-xl d-hdpi-2:text-vw-xl"></i>
                        </span>
                        {ContentDays}
                    </div>
                    <div className="flex items-center mr-8 py-1 d-hdpi-2:mr-vw-8 d-hdpi-2:py-vw-1">
                        <span className="text-green-400 mr-2 d-hdpi-2:mr-vw-2">
                            <i className="ri-stack-line text-xl d-hdpi-2:text-vw-xl"></i>
                        </span>
                        <div className="flex items-center gap-2 d-hdpi-2:gap-1">
                            {cats_list.map((cat, index) => {
                                return (
                                    <span
                                        key={`cats_${index}`}
                                        className="uppercase text-xs d-hdpi-2:text-vw-xs tracking-wide">
                                        {index < cats_list.length - 1
                                            ? `${cat}, `
                                            : cat}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    globalState: state.globalState
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SectionMarketingTitles);
