export default function menu(t) {
  return [
    [
      { text: t.btnFarm, callback_data: "farm" },
      { text: t.btnBalance, callback_data: "balance" }
    ],
    [
      { text: t.btnReferral, callback_data: "referral" },
      { text: t.btnHelp, callback_data: "help" }
    ],
    [
      { text: t.btnLang, callback_data: "lang" }
    ]
  ];
}
