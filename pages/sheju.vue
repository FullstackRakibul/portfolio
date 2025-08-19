<template>
  <div
    class="p-10 relative w-full min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
    <!-- Background Particle Canvas -->
    <canvas ref="bgCanvasRef" class="w-full h-full absolute top-0 left-0 opacity-40" />

    <!-- Main Name Particle Canvas -->
    <canvas ref="canvasRef" class="w-full h-full absolute top-0 left-0 touch-none cursor-none"
      aria-label="Interactive particle effect with Senjuti name" />

    <!-- Particle Trail Canvas -->
    <canvas ref="trailCanvasRef" class="w-full h-full absolute top-0 left-0 pointer-events-none opacity-60" />

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 w-full ">
      <div class="text-center animate-fade-in-up">
        <!-- Heart Icon - Modernized -->
        <div class="animate-fade-in-up mb-8">
        </div>

        <!-- Particle Name Area -->
        <div class="h-32 sm:h-40 lg:h-48 mb-8 flex items-center justify-center ">
          <span class="sr-only">সেঁজুতি</span>
        </div>

        <div
          class="w-12 h-12 mx-auto bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 ease-in-out">
          <Heart class="w-8 h-8 text-white" />
        </div>
      </div>
    </div>

    <!-- Floating Hearts -->
    <div class="absolute inset-0 pointer-events-none z-5">
      <div v-for="n in 8" :key="n" class="absolute animate-float" :style="{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's',
        animationDuration: (4 + Math.random() * 3) + 's'
      }">
        <Heart class="w-5 h-5 text-rose-300 opacity-70" />
      </div>
    </div>

    <!-- Mouse follower effect - hidden on mobile -->
    <div ref="mouseFollower"
      class="fixed w-6 h-6 border-2 border-rose-400/60 rounded-full pointer-events-none z-20 transition-all duration-300 hidden sm:block"
      :style="{
        left: mousePosition.x - 12 + 'px',
        top: mousePosition.y - 12 + 'px',
        opacity: isMouseMoving ? 0.9 : 0,
        transform: isMouseMoving ? 'scale(1.5)' : 'scale(1)'
      }" />
  </div>
</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import { Heart } from 'lucide-vue-next'
import { definePageMeta, useHead } from '#imports'

// Exclude default Nuxt layout if this component is used as a page
definePageMeta({
  layout: false
})

const canvasRef = ref(null)
const bgCanvasRef = ref(null)
const trailCanvasRef = ref(null)
const mouseFollower = ref(null)
const mousePosition = ref({ x: 0, y: 0 })
const mousePositionRef = ref({ x: 0, y: 0 })
const isMobile = ref(false)
const isMouseMoving = ref(false)

let particles = []
let bgParticles = []
let trailParticles = []
let svgPaths = []
let animationFrameId = null
let bgAnimationFrameId = null
let trailAnimationFrameId = null
let mouseTimeout = null

// Enhanced color palette for a sweeter, modern design
const sweetModernColors = ['#f87171', '#fb7185', '#ec4899', '#f472b6', '#c084fc', '#e879f9']

// Inline SVG data - Replace this with your SVG code
const inlineSVGData = `
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 682.1271710084 219.4974743832">
  <path d="m592.1235632949,172.2980659429c8.0783135625,0,15.837755693.0014865313,23.5971978235-.0003978042,7.6598654706-.0018633984,15.3240021016.1383730375,22.9771677129-.0901549856,2.6634453447-.0795398955,5.6620511544-.4880219597,7.8369930028-1.8316997369,1.8362639571-1.1344955986,3.7277180058-3.8474781158,3.7104658679-5.8455646781-.0171683896-2.0012899326-1.9426242246-4.7589521385-3.8029239272-5.7805969772-2.4557497042-1.3485561124-5.6536763302-1.7563681906-8.5486855644-1.8189909407-9.5989722691-.2076956472-19.2095017956.0904062303-28.8062966104-.161445679-3.951577057-.1037012642-8.0111055982-.6686878609-11.794181192-1.7905165375-13.3714955844-3.965207211-20.8949351686-13.9734574615-21.0497856683-27.9290556097-.1636440651-14.7462862648-.0489508475-29.4956502776-.055692581-44.243684787-.0005862377-1.251083624-.0000837482-2.5021672479-.0000837482-4.2206498263h-15.5450974609v-15.7305898548c8.297775831-.7458513999,16.1483779231-2.9879489421,22.4345628521-8.8498026538,6.4112629286-5.9784940797,8.5267853991-13.8163457542,8.8849766307-22.3973165421h15.5707662971v30.9245314253h15.4702265324v15.7996612198h-15.3374018204v4.0996964237c-.000334993,13.719134979-.0159959142,27.438290895.0037686709,41.1574049369.0170008932,11.8016142282,5.6859194034,17.3859053195,17.447773774,17.5559142565,6.9550402648.1005188309,14.0480976326-.2508678674,20.8259266171.9872661842,11.911428731,2.1758422119,20.6120336067,8.943579751,23.2550443803,21.3367078324,2.6688889804,12.5134743093,1.2710470709,24.2673311009-9.4035876202,33.0613155496-5.9439477375,4.8968436236-13.096717602,7.1305139986-20.6878257658,7.1622127093-31.8963555005.1332434575-63.7942184694.1620109796-95.6904064735.0018005873-17.9945241728-.0903852932-29.9789813709-13.2189485867-30.0316171411-32.5919275743-.0751221732-27.6608099815-.019722711-55.321934019-.0189689768-82.9829324341.0002512447-8.2314788937-.0873075424-16.4642558852.0300656189-24.6940912195.1415345292-9.9275902222,6.0020271434-16.1132355855,15.1995940879-16.2818417394,9.7696093124-.179085153,15.9855713404,5.6926299145,16.1601445511,15.5644333371.1536361502,8.6860853037.0363467371,17.3769756629.0378960796,26.0657409105.0049830204,27.8955563118-.0358023735,55.791259183.0391941773,83.6866270613.0256688362,9.5646776717,2.7381487767,18.1946621199,10.7728713791,24.080572515,3.2486780608,2.3798319993,7.199627006,3.8694620301,10.9693028811,5.4300058873,1.2084033858.5002701405,2.9505761929.2175151289,4.2961173252-.1991952003,11.9933345118-3.7141718471,18.9884901846-11.7421320373,20.6144623057-24.2891056446.2043038367-1.5768328908.3889687106-3.1562410401.6380359827-5.184330411Z"/>
  <path d="m89.7877256823,47.2252128027c-1.3753555065,0-2.6107886375-.0000418741-3.8462217684.0000104685-14.0598747292.0006176433-28.1210370876-.0982576282-42.1785563975.0841774546-2.8772441383.0373517172-6.0147359391.5807836094-8.5535638995,1.8491193718-5.2632420254,2.6293913004-5.2547520473,8.98155958.0373621845,11.5904116233,2.64574306,1.304274228,5.9032774974,1.8007024177,8.903223279,1.8733435516,9.596365605.2323909109,19.2036184816-.0128867612,28.8024546598.1601580497,3.3988386589.0612827782,6.8723807498.4510575781,10.1627654352,1.2814842368,14.1686741643,3.5758930264,22.3734685094,13.9159119487,22.5411534272,28.530828623.1691505121,14.7438261601.0508142459,29.4909289703.0582678395,44.2366080603.0006281118,1.2452107783.0000628112,2.4904424936.0000628112,4.0905992706h15.4301320615v15.7368395676c-18.7161199641,1.9267121206-30.3378007144,11.1307279759-31.2129698447,31.1960537036h-15.4695774835v-30.851052809h-15.4918126418v-15.8147254353h15.0977457569c.0873075424-1.5417633132.2035710396-2.647240145.2043666479-3.7528007251.0099869779-13.8312529417.0302854581-27.6625896317-.0074640621-41.4937483567-.0323268215-11.8470371825-5.6585337283-17.4645449214-17.4483495431-17.5109728547-4.5722562166-.0179954041-9.1453289785.0422719266-13.7168209923-.0210626836-25.2531204097-.3498268872-39.896688981-25.44749043-27.6377573878-47.6210211934,5.7785554278-10.4520426684,15.7478414865-14.771996976,26.9349002657-14.9193206071,32.2290035183-.4244570419,64.4687896228-.3165369599,96.7014780637-.0588854846,17.0157165928.1360071496,29.2619917329,13.0665267811,29.3876978444,31.1274743596.2537571737,36.4581234229.1598335201,72.9194920903.0371423454,109.378934548-.0376029607,11.1745911192-8.1515095261,17.6514081927-19.1714800937,15.8448538664-7.4102538349-1.2148311025-12.1785646864-7.2911431322-12.2270549185-15.8860580028-.0741590684-13.1449779495-.019366781-26.2907096331-.0194086551-39.4361063238-.0000837482-22.8615854058.1397548791-45.7247306227-.1135416793-68.5835104623-.0533476302-4.8138595815-.9330182286-9.825605797-2.5103954322-14.3719944216-3.1879187111-9.1884177447-10.5806691634-14.0095738921-19.6152620287-16.5337878654-1.016850219-.2840949835-2.2778475008-.0808484619-3.3335778412.2197449259-12.3432346675,3.5144322832-19.6303995235,12.1455159271-21.1668657108,24.9649644489-.1747197702,1.4579313202-.359028714,2.9147006334-.5780722414,4.6894410953Z"/>
  <path d="m309.3397513824,172.8129710891c-8.2806911896-.4481577952-16.4764197876-.0881031536-24.3547006737-1.4998473167-12.952503129-2.3209779202-22.0499909242-14.2555634242-22.2813873172-28.9018752217-.3449590094-21.8333558614-.4501468015-43.6843197912.0302749895-65.5126298208.3984741361-18.1038476169,12.8218977454-29.620822498,30.9391968411-29.7591327243,10.4045047361-.0794352102,20.8372326298-.4621542206,31.2043437757.1655598115,5.5617207604.336762161,11.312377555,1.8234714718,16.443381106,4.0324884572,8.31473485,3.5796407603,13.3168079823,10.5921011393,14.5292731579,19.4944872223,1.0237385119,7.5167923093.835263093,15.1986628778,1.2011591629,23.1972379026h-62.8070360652v46.9398653126h15.0954950229v31.8438463774Zm-14.9284172799-94.7590453218h30.5707045757c-.5911788413-10.0028170831-6.9300414145-15.7748508022-16.3261754412-15.1113972067-8.9862282555.6344871714-14.976195652,6.9066340031-14.2445291346,15.1113972067Z"/>
  <path d="m325.1662429369,125.4754900472h62.6521018173c.0704322716-1.3933404863.1743638401-2.5031722269.1752850708-3.6130667786.0111803903-13.259733982-.06431865-26.5201588869.0651142583-39.7786261767.0270088081-2.764550499-.6271487112-3.8992345312-3.5826241763-3.7151244834-3.8576952776.240284183-7.7416456291.0588122049-11.87097833.0588122049v-31.8792614164c8.7131252379.6376381991,17.4994045653.3274032946,25.8365839442,2.1135439863,12.5976199529,2.698870938,20.7831731395,15.2543973347,20.8843828901,30.0136017663.1042665615,15.2022640523.0238263749,30.4057947968.0228632701,45.6087602407-.0003768671,5.6010826144.0724841036,11.2034633266-.021104557,16.8030175355-.3196251661,19.1286644204-12.4907990701,31.2004714235-31.5872826129,31.3181377075-10.1729827207.0626646242-20.3470960427.060884974-30.5200787634-.0033289927-19.6027835407-.1237170947-31.9504987391-12.477106634-32.0505778884-32.0006230917-.0245382349-4.7913627092-.0036849226-9.5829347891-.0036849226-14.9258425017Zm31.7050326414,15.8902454151c.8216540036,10.4840659035,7.5111285926,16.3022658426,17.0344343249,15.1772547327,8.8727493874-1.0481302211,14.6732363861-7.5100401071,13.514537582-15.1772547327h-30.5489719069Z"/>
  <path d="m424.3282652917,47.314949047c11.051585529,0,21.1470592516-.6335764092,31.1325296581.1442772888,16.1216203597,1.2558572739,26.6556836264,14.2022262608,26.7308476737,31.8483269085.083706368,19.6584558172.018340865,39.3175397462.0202670746,58.9763514934.0000837482,1.1427448007-.0288093953,2.2886092236.0416228763,3.4277109757.4534548571,7.3309444855,4.4915438482,12.7585635478,10.6712428873,14.3842216653,7.600487967,1.9994474713,14.0122952591-.3416090907,18.241539613-6.6545308491.2455917201-.3666079418.5286189044-.7081542212.8983255193-1.1997354813-.1311497472,8.7757482683-8.3322801068,19.1247073158-17.8238452553,22.3040628714-8.0400824899,2.6931551203-16.2668816857,2.7860109867-24.2622426144-.0090448104-10.9176720898-3.8167006359-16.2859762849-12.3868260261-18.5046347156-23.229543788-.5674362146-2.7729043864-.7683901216-5.6632238121-.7784817848-8.5008865288-.0663286078-18.6299226853-.0342111569-37.2601803637-.034253031-55.8903333567-.0000837482-21.2741897677-5.40594903-28.7791317004-26.3329179012-35.6008763888Z"/>
  <path d="m257.5168416371,172.4233533171c-4.6710582052,0-8.3950912884.0019680838-12.1191034344-.0005024895-4.4566627054-.0029521256-8.9133463478.001381846-13.369967179-.0166868378-19.9258005106-.080712371-32.2223455331-12.3520286303-32.3074756212-32.4141928617-.0819476549-19.3118218318-.0173986973-38.6242927126-.0187177321-57.936480943-.0000837482-1.2569564696.0270506822-2.5155983727-.0261503886-3.7705867586-.3207976415-7.5665178297-4.2702181813-13.089233024-10.5595017952-14.8008063722-7.6888214254-2.0924603657-14.1061770386.2636604118-18.4756368868,6.7743013077-.1840576992.2742545648-.4373961316.5019974481-.6948801021.7924887038-.1705742322-7.4961693041,7.3383559691-17.6199711953,15.7697939945-21.33843514,22.522728814-9.9330443266,45.3345146857,4.6996583811,45.4557821403,29.2575330805.1026962819,20.7972225763-.072274733,41.5960363692.068820118,62.3928192673.0790792776,11.6580487995,4.3501140043,21.2213027511,15.208597024,26.7871482914,3.1895099277,1.6349122986,6.7133637751,2.6175095181,11.0684398627,4.273400752Z"/>
  <path d="m0,93.9843284659c8.9139535225,0,17.8282734436-.0511178349,26.7417663508.0135672157,10.0385772606.0728505045,16.2132409366,6.1789245667,16.3536239275,16.3014074231.1268053071,9.1448895945.0309135699,18.2928359999.0326827515,27.4394424334.0038628877,20.0478432815,5.8596551318,28.0630737385,24.896091185,34.0456086711-.0979016951.1627019027-.1922336213.4565116826-.2863247713.4564488714-9.9407279082-.0080398315-19.9228902592.5246827539-29.8120397187-.203885102-13.5387722296-.997441596-22.8681379701-10.4515506474-25.5397487685-24.7141698612-.5222121638-2.787832511-.7385234048-5.6659665671-.7715516178-8.5062254794-.0983413733-8.4594520846-.2696902767-16.929058644.028191752-25.3791518623.3223888581-9.1448686574-2.1262736511-16.2699390201-11.6426910905-19.4530423097Z"/>
  <path d="m682.1271710084,125.369736951c-9.9959389368,0-20.0180910734.4469434456-29.9795257345-.1389383382-8.2323684539-.4841904775-13.2711651903-7.1891796441-13.3473760907-16.2930744727-.0765458933-9.140953427-.0139022082-18.2830374552-.0177546273-27.4246294626-.0084585725-19.9522970027-6.3433431042-28.3696446573-25.5037684299-34.2205064119,1.2646822045-.0568964638,2.5291969126-.1603046091,3.7939628653-.1630159586,7.3133152447-.0156818588,14.6271329788.0493695903,21.9398619858-.0183618027,21.1064832283-.195478872,30.469117958,14.7091962609,31.1808105197,30.9945868321.4087751699,9.3523758711.304006119,18.7439145151.0175871308,28.1052095742-.2803053664,9.1644448096,2.3071803226,16.1974967883,11.9162023808,19.1587300403Z"/>
  <path d="m670.2656562297,15.7326589068c.0202670746,8.6372391399-6.9709524308,15.7201631984-15.5750793315,15.7793732074-8.6712929909.0596706244-15.9740559571-7.2429669543-15.8908102044-15.8906641563C638.8815887263,7.112033325,646.1098995052-.0214851419,654.6288544437.0000486256c8.5794211693.0216803269,15.6165347114,7.1018773331,15.636801786,15.7326102812Z"/>
  <path d="m27.2775980725,219.4928190386c-8.5559402559-.0229470191-15.6713793415-7.1496923466-15.6866529271-15.7115894718-.015221243-8.5318943164,7.1030234087-15.7266641559,15.629358661-15.7974104857,8.6272832897-.0715628752,15.9764323135,7.2850504474,15.8919512742,15.9080837912-.0833295009,8.5065604724-7.3071911545,15.6237794371-15.834657008,15.6009161662Z"/>
  <path d="m293.9327547729,203.5797731638c.0825338926,8.6706651581-6.9034094735,15.8335059792-15.5238672815,15.9169401681-8.7178988877.0843554196-15.7674071696-6.8543122871-15.8219691494-15.5731954972-.0548550986-8.7693415276,6.8282454262-15.857730159,15.4804019438-15.9421274527,8.5976782861-.0838319931,15.7834030839,6.9809186962,15.865434487,15.5983827818Z"/>
  <path d="m419.3304214456,15.6451943336c.064695517,8.7600245353-6.813296365,15.7850785566-15.5336658258,15.8658328017-8.6341506455.0799481682-15.7320654114-6.9518789924-15.7803881471-15.6334628279-.0484483581-8.7029291694,6.9066337808-15.8025767055,15.5468980481-15.870041151,8.65228214-.0675481937,15.7028372749,6.9251004911,15.7671559249,15.6376711772Z"/>
</svg>
`

const createBgParticle = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return null

  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.4 + 0.1,
    color: sweetModernColors[Math.floor(Math.random() * sweetModernColors.length)]
  }
}

const createTrailParticle = (x, y, color) => {
  return {
    x: x + (Math.random() - 0.5) * 10,
    y: y + (Math.random() - 0.5) * 10,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 3 + 1,
    opacity: 0.8,
    color: color,
    life: 30 + Math.random() * 20,
    maxLife: 30 + Math.random() * 20
  }
}

const animateBackground = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  bgParticles.forEach((particle, i) => {
    particle.x += particle.vx
    particle.y += particle.vy

    // Wrap particles around the canvas
    if (particle.x < 0) particle.x = canvas.width
    if (particle.x > canvas.width) particle.x = 0
    if (particle.y < 0) particle.y = canvas.height
    if (particle.y > canvas.height) particle.y = 0

    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
    ctx.fill()

    // Connect nearby particles with gentle lines
    for (let j = i + 1; j < bgParticles.length; j++) {
      const dx = particle.x - bgParticles[j].x
      const dy = particle.y - bgParticles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) {
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(bgParticles[j].x, bgParticles[j].y)
        ctx.strokeStyle = particle.color + '20'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }
  })

  bgAnimationFrameId = requestAnimationFrame(animateBackground)
}

const animateTrails = () => {
  const canvas = trailCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Fade the existing trails
  ctx.fillStyle = 'rgba(253, 242, 248, 0.1)' // Very light pink fade
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Update and draw trail particles
  for (let i = trailParticles.length - 1; i >= 0; i--) {
    const particle = trailParticles[i]

    particle.x += particle.vx
    particle.y += particle.vy
    particle.vx *= 0.98 // Slow down over time
    particle.vy *= 0.98
    particle.life--

    const alpha = particle.life / particle.maxLife
    particle.opacity = alpha * 0.6

    if (particle.life <= 0) {
      trailParticles.splice(i, 1)
      continue
    }

    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
    ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
    ctx.fill()
  }

  trailAnimationFrameId = requestAnimationFrame(animateTrails)
}

const parseSVGPath = (pathData) => {
  const points = []
  const path = new Path2D(pathData)

  // Sample points along the path
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 682
  canvas.height = 219

  ctx.fillStyle = 'black'
  ctx.fill(path)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Sample every few pixels to get path points
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const index = (y * canvas.width + x) * 4
      if (data[index + 3] > 128) { // Alpha channel
        points.push({ x, y })
      }
    }
  }

  return points
}

// Updated function to use inline SVG data instead of fetching from file
const loadSVGPaths = () => {
  try {
    // Parse inline SVG data
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(inlineSVGData, 'image/svg+xml')
    const paths = svgDoc.querySelectorAll('path')

    svgPaths = []
    paths.forEach(path => {
      const pathData = path.getAttribute('d')
      const points = parseSVGPath(pathData)
      svgPaths.push(...points)
    })

    return true
  } catch (error) {
    console.error('Error parsing inline SVG:', error)
    return false
  }
}

const createParticleFromSVG = () => {
  if (svgPaths.length === 0) return null

  const canvas = canvasRef.value
  if (!canvas) return null

  const randomPoint = svgPaths[Math.floor(Math.random() * svgPaths.length)]

  // Scale and position the SVG to fit the canvas
  const scale = isMobile.value ? 0.6 : 1.0
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2 - (isMobile.value ? 60 : 40)

  const scaledX = centerX + (randomPoint.x - 341) * scale // 341 is half of SVG width
  const scaledY = centerY + (randomPoint.y - 110) * scale // 110 is half of SVG height

  const centerDistance = Math.abs(scaledX - centerX)
  const maxDistance = canvas.width / 2
  const colorIndex = Math.floor((centerDistance / maxDistance) * sweetModernColors.length)

  return {
    x: scaledX,
    y: scaledY,
    baseX: scaledX,
    baseY: scaledY,
    size: Math.random() * 1.5 + 0.8,
    color: '#be185d',
    scatteredColor: sweetModernColors[Math.min(colorIndex, sweetModernColors.length - 1)],
    life: Math.random() * 300 + 200,
    originalLife: Math.random() * 300 + 200,
    trail: []
  }
}

const createInitialParticles = () => {
  const canvas = canvasRef.value
  if (!canvas || svgPaths.length === 0) return

  const baseParticleCount = isMobile.value ? 3000 : 5000
  const particleCount = Math.min(baseParticleCount, svgPaths.length)

  particles = []
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticleFromSVG()
    if (particle) particles.push(particle)
  }
}

const createBgParticles = () => {
  const canvas = bgCanvasRef.value
  if (!canvas) return

  const particleCount = isMobile.value ? 80 : 50
  bgParticles = []
  for (let i = 0; i < particleCount; i++) {
    const particle = createBgParticle()
    if (particle) bgParticles.push(particle)
  }
}

const animate = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const { x: mouseX, y: mouseY } = mousePositionRef.value
  const maxDistance = isMobile.value ? 100 : 180
  const repelForce = isMobile.value ? 30 : 60

  particles.forEach((p, i) => {
    const dx = mouseX - p.x
    const dy = mouseY - p.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    let isScattered = false

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance
      const angle = Math.atan2(dy, dx)
      const moveX = Math.cos(angle) * force * repelForce
      const moveY = Math.sin(angle) * force * repelForce

      p.x = p.baseX - moveX
      p.y = p.baseY - moveY

      ctx.fillStyle = p.scatteredColor
      isScattered = true

      // Create trail particles when scattered
      if (Math.random() < 0.3) {
        trailParticles.push(createTrailParticle(p.x, p.y, p.scatteredColor))
      }

      if (Math.random() < 0.08) {
        ctx.shadowColor = p.scatteredColor
        ctx.shadowBlur = 6
      }
    } else {
      p.x += (p.baseX - p.x) * 0.08
      p.y += (p.baseY - p.y) * 0.08
      ctx.fillStyle = p.color
      ctx.shadowBlur = 0
    }

    const time = Date.now() * 0.001
    const floatX = Math.sin(time + i * 0.01) * 0.3
    const floatY = Math.cos(time + i * 0.01) * 0.2

    ctx.beginPath()
    ctx.arc(p.x + floatX, p.y + floatY, p.size, 0, Math.PI * 2)
    ctx.fill()

    p.life--
    if (p.life <= 0) {
      const newParticle = createParticleFromSVG()
      if (newParticle) {
        particles[i] = newParticle
      }
    }
  })

  animationFrameId = requestAnimationFrame(animate)
}

const updateCanvasSize = () => {
  const canvas = canvasRef.value
  const bgCanvas = bgCanvasRef.value
  const trailCanvas = trailCanvasRef.value
  if (!canvas || !bgCanvas || !trailCanvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  bgCanvas.width = window.innerWidth
  bgCanvas.height = window.innerHeight
  trailCanvas.width = window.innerWidth
  trailCanvas.height = window.innerHeight
  isMobile.value = window.innerWidth < 768
}

const handleMove = (x, y) => {
  mousePositionRef.value = { x, y }
  mousePosition.value = { x, y }
  isMouseMoving.value = true

  clearTimeout(mouseTimeout)
  mouseTimeout = setTimeout(() => {
    isMouseMoving.value = false
  }, 1500)
}

const handleMouseMove = (e) => {
  if (!isMobile.value) {
    handleMove(e.clientX, e.clientY)
  }
}

const handleTouchMove = (e) => {
  if (e.touches.length > 0) {
    e.preventDefault()
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }
}

const handleResize = () => {
  updateCanvasSize()
  particles = []
  createInitialParticles()
  createBgParticles()
}

onMounted(() => {
  updateCanvasSize()
  createBgParticles()
  animateBackground()
  animateTrails()

  // Use inline SVG data instead of fetching
  const svgLoaded = loadSVGPaths()
  if (svgLoaded) {
    createInitialParticles()
    animate()
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (bgAnimationFrameId) {
    cancelAnimationFrame(bgAnimationFrameId)
  }
  if (trailAnimationFrameId) {
    cancelAnimationFrame(trailAnimationFrameId)
  }

  clearTimeout(mouseTimeout)
})

useHead({
  title: 'sweetheart | সেঁজুতি',
  meta: [
    { name: 'description', content: 'between you and everything' }
  ]
})
</script>

<style scoped>
.cursor-none {
  cursor: none;
}

@media (max-width: 768px) {
  .cursor-none {
    cursor: default;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-25px) rotate(180deg);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.9s ease-out forwards;
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animation-delay-600 {
  animation-delay: 0.6s;
  opacity: 0;
}

.animation-delay-800 {
  animation-delay: 0.8s;
  opacity: 0;
}

.animation-delay-1000 {
  animation-delay: 1.0s;
  opacity: 0;
}
</style>