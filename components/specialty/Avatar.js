const Avatar = ({
    profile,
    card,
    size = 'w-8 h-8 d-hdpi-2:w-vw-8 d-hdpi-2:h-vw-8',
    username = 'Konnect'
}) => {
    return (
        <div className={`${card ? 'absolute z-100 inline-block' : ''}`}>
            <div
                className={`${size} ${
                    card ? 'text-xs d-hdpi-2:text-vw-xs' : ''
                } rounded-full flex justify-center items-center bg-white text-white overflow-hidden`}>
                {profile?.avatar && profile?.avatar != 'null' ? (
                    <img
                        src={profile.avatar}
                        className="object-cover w-full h-full w-11 h-11 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                    />
                ) : (
                    <div>{`${(profile?.first ?? username)
                        .charAt(0)
                        .toUpperCase()}${
                        profile?.last?.charAt(0)?.toUpperCase() ?? ''
                    }`}</div>
                )}
            </div>
        </div>
    );
};

export default Avatar;

// `${profile?.first?.charAt(0)?.toUpperCase()}${profile?.last
//     .charAt(0)
//     .toUpperCase()}`
