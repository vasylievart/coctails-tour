import Image from "next/image";
import React from "react";

export interface FAQImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  images?: FAQImage[];
}

export const faqs: FAQItem[] = [
  {
    question: "How much time take the tour??",
    answer:
      "The tour takes 2.5 hours and is quite intense. Therefore, we ask our guests not to be late for the comfort of all members.",
    images: [{src: '/images/faq/clocks_time.webp', alt: "Clock showing tour time", width:80, height:80}]
  },
  {
    question: "What will be the route?",
    answer:
      "The route consist of 4 the best and interesting coctail bars in Barcelona, tapas bars as well a city center tour.",
    images: [{src:'/images/faq/route.png',  alt:"Route image", width:64, height:144}]
  },
  {
    question: "What language are available for the tour?",
    answer:
      "At the moment, tours are conducted in English, Spanish, Catalan and Ukrainian. In the near future we will try to expand this list for your comfort.",
    images:[
      {src:'/images/faq/british_flag.png', alt:"English", width:64, height:64},
      {src:'/images/faq/spanish_flag.png', alt:"Spanish", width:64, height:64},
      {src:'/images/faq/catalan_flag.png', alt:"Catalan", width:64, height:64},
      {src:'/images/faq/ukrainian_flag.png', alt:"Ukrainian", width:64, height:64}
    ]
  },
  {
    question: "What does the tour include?",
    answer:
      "It includes any coctail at each location, as well as snaks and tapas.",
    images:[
        {src:'/images/faq/faq_coctail_1.png', alt:"Cocteil's picture", width:28, height:55},
        {src:'/images/faq/faq_coctail_2.png', alt:"Cocteil's picture", width:36, height:82},
        {src:'/images/faq/faq_coctail_3.png', alt:"Cocteil's picture", width:48, height:67},
    ]
  },
  {
    question: "Do I have to pay extra for drinks, food or bar pass?",
    answer:
      "All tour expenses, including food and drink, as well as taxes, are all included in the tour price.",
    images:[{src:'/images/faq/reject_icon.png', alt:"Reject icon", width:48, height:48}],
  },
  {
    question: "Is it possible to pay by card?",
    answer:
      "Unfortunately, only cash payment is available at the moment, but we are working on it.",
    images:[{src:'/images/faq/cart_payment.webp', alt:"Cart payment picture", width:64, height:84}],
  },
  {
    question: "Can we pay in US dollar?",
    answer:
      "The official currency of payment in Spain is the erui, but for your comfort we can acceps payment in US dollars, but the price of the tour will be changed taking into the exchange fee. Please notify us in advance in the comments",
    images:[{src:'/images/faq/cash_money.webp', alt:"Hand with euro", width:240, height:161}],
  },
  {
    question: "What is hte maximum number of people in a group?",
    answer:
      "The maximum number of people on the tour is 8 people. If threr are more of you, please indicate this selected 'Private' and add the exact number in the comments and we will contact you to find a solution.",
    images:[ 
        {src:'/images/faq/person_1.png', alt:"Person #1", width:24, height:63},
        {src:'/images/faq/person_2.png', alt:"Person #2", width:24, height:69},
        {src:'/images/faq/person_3.png', alt:"Person #3", width:24, height:70},
        {src:'/images/faq/person_4.png', alt:"Person #4", width:24, height:77},
        {src:'/images/faq/person_5.png', alt:"Person #5", width:24, height:62},
        {src:'/images/faq/person_6.png', alt:"Person #6", width:24, height:60},
        {src:'/images/faq/person_7.png', alt:"Person #7", width:24, height:57},
        {src:'/images/faq/person_8.png', alt:"Person #8", width:24, height:59},
    ]
  },
  {
    question: "Is it possible to book a private tour?",
    answer:
      "If you want to book atour just for your family or friends, without strangers, you can select the 'Private' option in the booking form. However, the priceof a tour is subject to change",
    images: [{src:'/images/faq/accept_icon.png', alt:"Accept icon", width:48, height:48}]
  },
  {
    question: "Can I modify or cancel my booking?",
    answer:
      "Yes, you can modify or cancel your booking up to 24 hour. Please use your email, and confirmation number in the form below to change of cancel your tour",
    images:[{src:'/images/faq/change_data.png', alt:"Switch date picture", width:48, height:48}]
  },
];