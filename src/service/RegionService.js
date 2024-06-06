const { VITE_PUBLIC_DATA_SERVICEKEY } = import.meta.env;
export const RegionService = {
    getRegionsData() {
        return[
            {
                code: 1,
                name: "서울",
                img: "seoul_icon.png"
            },
            {
                code: 2,
                name: "인천",
                img: "incheon_icon.png"
            },
            {
                code: 3,
                name: "대전",
                img: "daejeon_icon.png"
            },
            {
                code: 4,
                name: "대구",
                img: "daegu_icon.png"
            },
            {
                code: 5,
                name: "광주",
                img: "gwangju_icon.png"
            },
            {
                code: 6,
                name: "부산",
                img: "busan_icon.png"
            },
            {
                code: 7,
                name: "울산",
                img: "ulsan_icon.png"
            },
            {
                code: 8,
                name: "세종",
                img: "saejong_icon.png"
            },
            {
                code: 31,
                name: "경기도",
                img: "gyeonggi_icon.png"
            },
            {
                code: 32,
                name: "강원",
                img: "gangwon_icon.png"
            },
            {
                code: 33,
                name: "충청북도",
                img: "chungbuk_icon.png"
            },
            {
                code: 34,
                name: "충청남도",
                img: "chungnam_icon.png"
            },
            {
                code: 35,
                name: "경상북도",
                img: "gyeongbuk_icon.png"
            },
            {
                code: 36,
                name: "경상남도",
                img: "gyeongnam_icon.png"
            },
            {
                code: 37,
                name: "전라북도",
                img: "jeonbuk_icon.png"
            },
            {
                code: 38,
                name: "전라남도",
                img: "jeonnam_icon.png"
            },
            {
                code: 39,
                name: "제주도",
                img: "jeju_icon.png"
            }
        ];  
    },

    getTourTypeData() {
        return [
            { name: '관광지 유형', code: 0, image : "culture.png"},
            { name: '관광지', code: 12 ,image : "culture.png"},
            { name: '문화시설', code: 14 ,image : "tour.png"},
            { name: '축제공연행사', code: 15 ,image : "festival.png"},
            { name: '여행코스', code: 25 ,image : "course.png"},
            { name: '레포츠', code: 28 ,image : "course.png"},
            { name: '숙박', code: 32 ,image : "sport.png"},
            { name: '쇼핑', code: 38 ,image : "sleep.png"},
            { name: '음식점', code: 39 ,image : "shopping.png"},
        ]
    },

    getPostData() {
        return[
            {
                id: 1,
                title: '지도를 보면서 검색하고 싶은가요?',
                href: '#',
                description:
                    '지도에서 관광 유형별로 검색 할 수 있습니다. 관광지부터 음식점까지 한번에 해결해보세요.',
                date: 'Mar 12, 2020',
                datetime: '2020-03-12',
                category: { title: 'Traveling', href: '#' },
            },
            {
                id: 2,
                title: '여행 계획 어떻게 짜지?',
                href: '#',
                description:
                    'AI를 활용해 여행 계획을 추천해드립니다. 놀라운 경험을 지금 한번 해보세요~!',
                date: 'June 16, 2024',
                datetime: '2024-06-16',
                category: { title: 'Planning', href: '#' },
            },
            {
                id: 3,
                title: '다른 사람들은 어떻게 여행하지?',
                href: '#',
                description:
                    '여러 사람들이 기록해놓은 여행 일기를 한번 구경해보세요~~!',
                date: 'May 24, 2023',
                datetime: '2023-05-24',
                category: { title: 'Searching', href: '#' },
            },
        ]
    },

    getParamData() {
        return {
            serviceKey: VITE_PUBLIC_DATA_SERVICEKEY,
            MobileOS: "ETC",
            MobileApp: "AppTest",
            _type: "json",
            listYN: "Y",
            arrange: "A",
        }
    },

    getRegions() {
        return Promise.resolve(this.getRegionsData());
    },
    getTourTypes() {
        return Promise.resolve(this.getTourTypeData());
    },
    getPosts() {
        return Promise.resolve(this.getPostData());
    },
    getParams() {
        return Promise.resolve(this.getParamData());
    }
}