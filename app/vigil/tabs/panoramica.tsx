import Card from "@/components/card/card";

const PanoramicaTab = () => {
  return (
    <section className="p-4 bg-gray-100 rounded-b-2xl">
      <Card  >
        <h1 className="flex flex-row items-center gap-2 pb-2">
          <span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.4166 12.8333C18.7825 11.495 20.1666 9.89083 20.1666 7.79167C20.1666 6.45453 19.6355 5.17217 18.69 4.22667C17.7445 3.28117 16.4621 2.75 15.125 2.75C13.5116 2.75 12.375 3.20833 11 4.58333C9.62498 3.20833 8.48831 2.75 6.87498 2.75C5.53785 2.75 4.25548 3.28117 3.30998 4.22667C2.36449 5.17217 1.83331 6.45453 1.83331 7.79167C1.83331 9.9 3.20831 11.5042 4.58331 12.8333L11 19.25L17.4166 12.8333Z"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-semibold text-lg">Chi sono</span>
        </h1>

        <div>
          <p className="font-medium leading-relaxed text-[13px]">
           Ciao! Sono Marco, uno studente di Psicologia appassionato di scienze
            e sport. Mi piace socializzare e stare delle persone e imparare
            dalle loro esperienze. Sono disponibile per accompagnamento,
            commissioni e piccole commissioni.
          </p>
        </div>
      </Card>
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.1873 11.8158L15.576 19.6313C15.5916 19.7234 15.5787 19.8179 15.539 19.9024C15.4994 19.9869 15.4348 20.0573 15.3541 20.1041C15.2734 20.151 15.1803 20.1721 15.0873 20.1646C14.9942 20.1571 14.9057 20.1213 14.8335 20.0622L11.5519 17.5991C11.3934 17.4807 11.201 17.4168 11.0032 17.4168C10.8055 17.4168 10.613 17.4807 10.4546 17.5991L7.16743 20.0612C7.09531 20.1203 7.00689 20.156 6.91397 20.1635C6.82105 20.171 6.72805 20.15 6.64737 20.1033C6.5667 20.0566 6.50219 19.9864 6.46244 19.902C6.4227 19.8177 6.40961 19.7233 6.42493 19.6313L7.81277 11.8158"
              stroke="#009EDA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 12.8333C14.0376 12.8333 16.5 10.3709 16.5 7.33334C16.5 4.29578 14.0376 1.83334 11 1.83334C7.96243 1.83334 5.5 4.29578 5.5 7.33334C5.5 10.3709 7.96243 12.8333 11 12.8333Z"
              stroke="#009EDA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h3 className="text-lg font-semibold ">Competenze</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-consumer-light-blue text-blue-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
            Hard coded
          </span>
          <span className="bg-consumer-light-blue text-blue-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full ">
            Hard coded
          </span>
          <span className="bg-consumer-light-blue text-blue-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full ">
            hard coded
          </span>
        </div>
      </Card>
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.4166 12.8333C18.7825 11.495 20.1666 9.89083 20.1666 7.79167C20.1666 6.45453 19.6355 5.17217 18.69 4.22667C17.7445 3.28117 16.4621 2.75 15.125 2.75C13.5116 2.75 12.375 3.20833 11 4.58333C9.62498 3.20833 8.48831 2.75 6.87498 2.75C5.53785 2.75 4.25548 3.28117 3.30998 4.22667C2.36449 5.17217 1.83331 6.45453 1.83331 7.79167C1.83331 9.9 3.20831 11.5042 4.58331 12.8333L11 19.25L17.4166 12.8333Z"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="text-lg font-semibold">Interessi</h3>
        </div>
        <div className="flex flex-wrap gap-2 ">
          <span className="bg-vigil-light-orange text-red-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
            Hard coded
          </span>
          <span className="bg-vigil-light-orange text-red-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full ">
            Hard coded
          </span>
          <span className="bg-vigil-light-orange text-red-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full ">
            Hard coded
          </span>
        </div>
      </Card>
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.1873 11.8158L15.576 19.6313C15.5916 19.7234 15.5787 19.8179 15.539 19.9024C15.4994 19.9869 15.4348 20.0573 15.3541 20.1041C15.2734 20.151 15.1803 20.1721 15.0873 20.1646C14.9942 20.1571 14.9057 20.1213 14.8335 20.0622L11.5519 17.5991C11.3934 17.4807 11.201 17.4168 11.0032 17.4168C10.8055 17.4168 10.613 17.4807 10.4546 17.5991L7.16743 20.0612C7.09531 20.1203 7.00689 20.156 6.91397 20.1635C6.82105 20.171 6.72805 20.15 6.64737 20.1033C6.5667 20.0566 6.50219 19.9864 6.46244 19.902C6.4227 19.8177 6.40961 19.7233 6.42493 19.6313L7.81277 11.8158"
              stroke="#009EDA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 12.8333C14.0376 12.8333 16.5 10.3709 16.5 7.33334C16.5 4.29578 14.0376 1.83334 11 1.83334C7.96243 1.83334 5.5 4.29578 5.5 7.33334C5.5 10.3709 7.96243 12.8333 11 12.8333Z"
              stroke="#009EDA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="text-lg font-semibold">Le mie statistiche</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">45</p>
            <p className="text-[10px] text-muted-foreground">
              servizi completati
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">€1250</p>
            <p className="text-[10px] text-muted-foreground">guadagno totale</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">4.8</p>
            <p className="text-[10px] text-muted-foreground">
              valutazione media
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">23</p>
            <p className="text-[10px] text-muted-foreground">recensioni</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_126_1266)">
              <path
                d="M20.1667 15.51V18.26C20.1677 18.5153 20.1154 18.768 20.0132 19.0019C19.9109 19.2358 19.7609 19.4458 19.5728 19.6184C19.3846 19.791 19.1625 19.9224 18.9207 20.0041C18.6789 20.0859 18.4226 20.1163 18.1684 20.0933C15.3476 19.7868 12.6381 18.823 10.2575 17.2792C8.0427 15.8718 6.16491 13.994 4.75752 11.7792C3.20833 9.38777 2.24424 6.66508 1.94335 3.83167C1.92045 3.57818 1.95057 3.3227 2.03181 3.08149C2.11305 2.84028 2.24363 2.61863 2.41522 2.43065C2.58682 2.24267 2.79567 2.09248 3.0285 1.98965C3.26132 1.88681 3.513 1.83357 3.76752 1.83333H6.51752C6.96238 1.82895 7.39366 1.98649 7.73097 2.27657C8.06827 2.56665 8.28859 2.96949 8.35085 3.41C8.46692 4.29006 8.68218 5.15417 8.99252 5.98583C9.11585 6.31393 9.14254 6.6705 9.06943 7.01331C8.99633 7.35611 8.82648 7.67077 8.58002 7.92L7.41585 9.08417C8.72078 11.3791 10.6209 13.2792 12.9159 14.5842L14.08 13.42C14.3293 13.1735 14.6439 13.0037 14.9867 12.9306C15.3295 12.8575 15.6861 12.8842 16.0142 13.0075C16.8459 13.3178 17.71 13.5331 18.59 13.6492C19.0353 13.712 19.442 13.9363 19.7327 14.2794C20.0234 14.6225 20.1778 15.0604 20.1667 15.51Z"
                stroke="#009EDA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_126_1266">
                <rect width="22" height="22" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <h3 className="text-lg font-semibold">Contatti</h3>
        </div>
        <div className="space-y-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.3333 2.66667H2.66665C1.93027 2.66667 1.33331 3.26363 1.33331 4V12C1.33331 12.7364 1.93027 13.3333 2.66665 13.3333H13.3333C14.0697 13.3333 14.6666 12.7364 14.6666 12V4C14.6666 3.26363 14.0697 2.66667 13.3333 2.66667Z"
                stroke="#A5A5A5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.6666 4.66667L8.68665 8.46667C8.48083 8.59562 8.24286 8.66401 7.99998 8.66401C7.7571 8.66401 7.51913 8.59562 7.31331 8.46667L1.33331 4.66667"
                stroke="#A5A5A5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>email@com</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_126_1271)">
                <path
                  d="M14.6666 11.28V13.28C14.6674 13.4657 14.6294 13.6494 14.555 13.8196C14.4806 13.9897 14.3715 14.1424 14.2347 14.2679C14.0979 14.3934 13.9364 14.489 13.7605 14.5485C13.5846 14.608 13.3982 14.63 13.2133 14.6133C11.1619 14.3904 9.19131 13.6894 7.45998 12.5667C5.84919 11.5431 4.48353 10.1774 3.45998 8.56667C2.33329 6.82747 1.63214 4.84733 1.41331 2.78667C1.39665 2.60231 1.41856 2.41651 1.47764 2.24108C1.53673 2.06566 1.63169 1.90446 1.75649 1.76775C1.88128 1.63103 2.03318 1.5218 2.2025 1.44701C2.37183 1.37222 2.55487 1.33351 2.73998 1.33333H4.73998C5.06351 1.33015 5.37717 1.44472 5.62248 1.65569C5.8678 1.86666 6.02803 2.15963 6.07331 2.48C6.15772 3.12004 6.31428 3.74848 6.53998 4.35333C6.62967 4.59195 6.64908 4.85127 6.59591 5.10059C6.54274 5.3499 6.41922 5.57874 6.23998 5.76L5.39331 6.60667C6.34235 8.2757 7.72428 9.65763 9.39331 10.6067L10.24 9.76C10.4212 9.58076 10.6501 9.45723 10.8994 9.40406C11.1487 9.35089 11.408 9.3703 11.6466 9.46C12.2515 9.6857 12.8799 9.84225 13.52 9.92667C13.8438 9.97235 14.1396 10.1355 14.351 10.385C14.5624 10.6345 14.6748 10.953 14.6666 11.28Z"
                  stroke="#A5A5A5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_126_1271">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span>+39 333 123 4567</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.3334 6.66666C13.3334 10.6667 8.00002 14.6667 8.00002 14.6667C8.00002 14.6667 2.66669 10.6667 2.66669 6.66666C2.66669 5.25217 3.22859 3.89562 4.22878 2.89543C5.22898 1.89523 6.58553 1.33333 8.00002 1.33333C9.41451 1.33333 10.7711 1.89523 11.7713 2.89543C12.7714 3.89562 13.3334 5.25217 13.3334 6.66666Z"
                stroke="#A5A5A5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z"
                stroke="#A5A5A5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>address</span>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_126_1276)">
              <path
                d="M4.58331 7.33334L10.0833 12.8333"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.66669 12.8333L9.16669 7.33334L11 4.58334"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.83331 4.58334H12.8333"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.41669 1.83334H7.33335"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.1667 20.1667L15.5833 11L11 20.1667"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.8333 16.5H18.3333"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_126_1276">
                <rect width="22" height="22" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h3 className="text-lg font-semibold">Lingue</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Italiano</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Inglese</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Francese</span>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default PanoramicaTab;
