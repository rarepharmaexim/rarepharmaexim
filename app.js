(() => {
  /* ====================================================================
     1. HERO SCROLL ANIMATION (299 FRAMES SCRUBBING ENGINE)
     ==================================================================== */
  const FRAME_COUNT = 299;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const images = new Array(FRAME_COUNT);
  const isLoaded = new Array(FRAME_COUNT).fill(false);

  let currentFrame = 0;
  let targetFrame = 0;
  let lastDrawnFrame = -1;

  function getFrameUrl(index) {
    const num = String(index + 1).padStart(3, '0');
    return `./images/ezgif-frame-${num}.jpg`;
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.parentElement.clientWidth * dpr);
    canvas.height = Math.round(canvas.parentElement.clientHeight * dpr);
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    lastDrawnFrame = -1;
    drawFrame(Math.round(currentFrame));
  }

  function drawCover(img) {
    if (!img) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = Math.round(iw * scale);
    const nh = Math.round(ih * scale);
    const ox = Math.round((cw - nw) * 0.5);
    const oy = Math.round((ch - nh) * 0.5);

    ctx.drawImage(img, ox, oy, nw, nh);
  }

  function getLoadedImage(index) {
    if (isLoaded[index] && images[index]) {
      return images[index];
    }
    let left = index - 1;
    let right = index + 1;
    while (left >= 0 || right < FRAME_COUNT) {
      if (left >= 0 && isLoaded[left] && images[left]) {
        return images[left];
      }
      if (right < FRAME_COUNT && isLoaded[right] && images[right]) {
        return images[right];
      }
      left--;
      right++;
    }
    return null;
  }

  function drawFrame(index) {
    index = Math.max(0, Math.min(FRAME_COUNT - 1, index));
    const img = getLoadedImage(index);
    if (img && (index !== lastDrawnFrame || img.dataset.ready)) {
      drawCover(img);
      lastDrawnFrame = index;
    }
  }

  function updateHeroScroll() {
    const hero = document.getElementById('hero-scroll-section');
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const heroHeight = hero.offsetHeight - window.innerHeight;

    let progress = 0;
    if (heroHeight > 0) {
      progress = Math.max(0, Math.min(1, -rect.top / heroHeight));
    }
    targetFrame = progress * (FRAME_COUNT - 1);

    // Fade overlay text as user scrolls into the animation (opacity only, no transform override)
    const overlay = document.getElementById('hero-overlay');
    if (overlay) {
      const opacity = Math.max(0, 1 - progress * 2.8);
      overlay.style.opacity = opacity;
      overlay.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    }
  }

  function animationLoop() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) < 0.01) {
      currentFrame = targetFrame;
    } else {
      currentFrame += diff * 0.14;
    }

    const frameToDraw = Math.round(currentFrame);
    if (frameToDraw !== lastDrawnFrame) {
      drawFrame(frameToDraw);
    }

    requestAnimationFrame(animationLoop);
  }

  function preloadImages() {
    // 1. Immediately load frame 0
    const firstImg = new Image();
    firstImg.onload = () => {
      images[0] = firstImg;
      isLoaded[0] = true;
      firstImg.dataset.ready = 'true';
      drawFrame(0);
    };
    firstImg.src = getFrameUrl(0);
    images[0] = firstImg;

    // 2. Preload remaining frames
    for (let i = 1; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = () => {
        images[i] = img;
        isLoaded[i] = true;
        img.dataset.ready = 'true';
        if (Math.round(currentFrame) === i) {
          drawFrame(i);
        }
      };
      img.src = getFrameUrl(i);
      images[i] = img;
    }
  }

  window.addEventListener('scroll', updateHeroScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateHeroScroll();
  }, { passive: true });

  resizeCanvas();
  updateHeroScroll();
  currentFrame = targetFrame;
  preloadImages();
  requestAnimationFrame(animationLoop);
})();

/* ====================================================================
   2. 27 PRODUCTS CATALOG WITH DEEP BLOGGER POST DETAILS
   ==================================================================== */
const PRODUCTS = [
  // Page 1: 9 Products (Steroids Injectables)
  {
    id: "test-e-250mg",
    name: "Test-E 250mg/ml",
    subName: "Testosterone Enanthate USP",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-flask",
    packaging: "10ml Multi-Dose Amber Vial (250mg/ml)",
    purity: "HPLC Assay 99.4% Purity",
    description: "Long-acting testosterone ester for physiological hormone replacement therapy (TRT) and clinical anabolic protocols.",
    specs: ["USP / BP Pharmaceutical Grade", "Batch COA Certified Available", "Sealed Flip-Off Cap with Sterile Stopper"],
    table: {
      "Active Substance": "Testosterone Enanthate (250 mg/mL)",
      "CAS Number": "315-37-7",
      "Molecular Formula": "C26H40O3",
      "Pharmacopoeia Standard": "USP 43 / BP 2021",
      "HPLC Assay Purity": "99.4% (Conforms to Specification)",
      "Vehicle / Excipients": "Refined Sesame Oil, Benzyl Benzoate 20%, Benzyl Alcohol 2%",
      "Bacterial Endotoxins": "< 0.5 EU/mg (LAL Test Passed)",
      "Container & Closure": "10 mL Type-I Tubular Amber Vial with Chlorobutyl Stopper",
      "Storage Temperature": "15°C - 25°C (Excursions permitted up to 30°C)",
      "Shelf Life": "36 Months from Date of Manufacture",
      "Batch Documents": "COA, COPP, GMP Certificate & Analytical Testing Dossier"
    },
    indications: [
      "Primary and secondary hypogonadism in adult males.",
      "Androgen deficiency symptoms including fatigue, loss of bone mineral density, and low libido.",
      "Therapeutic adjuvant in catabolic states to promote nitrogen retention and positive protein synthesis."
    ],
    pharmacology: "Testosterone Enanthate provides a sustained biological release of free testosterone following intramuscular depot injection. The heptanoic acid ester ensures extended systemic bioavailability with a biological terminal half-life of 8-10 days, allowing stable peak-to-trough circulating levels.",
    handling: "Supplied in neutral validated secondary packaging. Shipments for international freight are palletized under temperature data-logger monitoring to prevent crystallization in transit."
  },
  {
    id: "test-c-250mg",
    name: "Test-C 250mg/ml",
    subName: "Testosterone Cypionate USP",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-flask",
    packaging: "10ml Multi-Dose Sterile Vial (250mg/ml)",
    purity: "HPLC Assay 99.2% Purity",
    description: "Slow-release depot androgenic-anabolic ester formulated in pharmaceutical grade sesame/MCT oil base.",
    specs: ["Extended 8-10 Day Half-Life", "Complete COA & Endotoxin Tested", "Export Batch Ready for Dispatch"],
    table: {
      "Active Substance": "Testosterone Cypionate (250 mg/mL)",
      "CAS Number": "58-20-8",
      "Molecular Formula": "C27H40O3",
      "Pharmacopoeia Standard": "USP 43 Grade",
      "HPLC Assay Purity": "99.2% (Batch Verified)",
      "Vehicle / Carrier": "Refined Cottonseed / Sesame Oil, Benzyl Benzoate, Benzyl Alcohol 2%",
      "Bacterial Endotoxins": "< 0.4 EU/mg",
      "Fill Volume": "10 mL Multi-Dose Amber Glass Vial",
      "Storage Condition": "Store at 20°C - 25°C, Protected from Direct Light",
      "Shelf Life": "36 Months",
      "Export Documentation": "Full Analytical COA, Packing List & Customs Airway Clearance"
    },
    indications: [
      "Clinical replacement therapy in conditions associated with a deficiency or absence of endogenous testosterone.",
      "Delayed puberty protocols under certified clinical endocrinological supervision.",
      "Preservation of lean muscle tissue mass and neuromuscular vigor in severe chronic debility."
    ],
    pharmacology: "Testosterone Cypionate is the eight-carbon cyclopentylpropionate ester. Following deep intramuscular injection, cellular esterases steadily hydrolyze the ester bond, liberating free active testosterone with an elimination half-life of approximately 8 days.",
    handling: "Maintained in temperature-controlled warehouses. Every master export carton is labeled with batch number, barcode, manufacturing date, and expiry."
  },
  {
    id: "primobol-100mg",
    name: "Primobol 100mg/ml",
    subName: "Methenolone Enanthate",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-dumbbell",
    packaging: "10ml Sterile Vial (100mg/ml)",
    purity: "Pharmaceutical Grade 99.0%+",
    description: "Mild anabolic steroid with low androgenic profile and zero aromatization to estrogens. Highly sought after for lean tissue retention.",
    specs: ["Non-Aromatizing Compound", "Gentle on Hepatic Markers", "Sealed Tamper-Evident Packaging"],
    table: {
      "Active Substance": "Methenolone Enanthate (100 mg/mL)",
      "CAS Number": "303-42-4",
      "Molecular Formula": "C27H42O3",
      "Chemical Name": "1(5a)-androsten-1b-methyl-17b-ol-3-one enanthate",
      "Purity Assay": "99.1% High Precision HPLC",
      "Vehicle": "Pharmaceutical Grade Oil Carrier, Benzyl Alcohol",
      "Endotoxins": "Complies with USP Sterility Guidelines",
      "Container": "10 mL Sterile Vial with Tamper-Evident Security Seal",
      "Storage": "Controlled Room Temperature 15°C - 25°C",
      "Shelf Life": "24 Months",
      "Documentation": "COA, WHO-GMP Quality Audit Certificate"
    },
    indications: [
      "Wasting conditions characterized by excessive protein catabolism.",
      "Osteopenia and muscle atrophy support in specialized rehabilitation.",
      "Anabolic support where progestogenic and estrogenic side effects must be avoided."
    ],
    pharmacology: "Methenolone is a DHT-derivative anabolic steroid. Due to its double bond at the 1,2 position, it is completely immune to aromatase conversion, eliminating gynecomastia and water retention risks while exerting a mild, pure anabolic effect.",
    handling: "Export consignments are packed with moisture barriers and thermal buffers to guarantee physical and biochemical stability."
  },
  {
    id: "trenbolone-acetate-100mg",
    name: "Trenbolone Acetate 100mg/ml",
    subName: "Trenbolone Acetate USP",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-fire",
    packaging: "10ml Vial (100mg/ml)",
    purity: "Ultra-High Anabolic Index 500/500",
    description: "Potent short-ester veterinary and clinical steroid compound for rapid nitrogen retention and intense cellular density.",
    specs: ["Fast-Acting Acetate Ester", "Pure Amber Sterile Oil", "Batch Tested & Certified"],
    table: {
      "Active Substance": "Trenbolone Acetate (100 mg/mL)",
      "CAS Number": "10161-34-9",
      "Molecular Formula": "C20H24O3",
      "Anabolic/Androgenic Ratio": "500 : 500 (Fivefold potency of Testosterone)",
      "HPLC Assay": "99.3% Purity",
      "Carrier Base": "Pharmaceutical Refined Oil, Benzyl Benzoate, Benzyl Alcohol",
      "Appearance": "Clear, Golden-Amber Sterile Solution",
      "Storage": "15°C - 25°C, Protected from Heat & Sunlight",
      "Shelf Life": "36 Months",
      "Certifications": "Batch Analysis, COA, Strict Cold-Chain Monitoring"
    },
    indications: [
      "Extreme tissue catabolism reversal in clinical veterinary and regulated medicinal models.",
      "High-efficiency nitrogen balance optimization.",
      "Cellular hardness and red blood cell count stimulation."
    ],
    pharmacology: "Trenbolone Acetate is a 19-nor derivative with three conjugated double bonds that inhibit aromatization and 5-alpha reduction. The short acetate ester ensures immediate systemic availability within 24-48 hours.",
    handling: "Requires specialized dark storage to prevent photodegradation. Exported in light-resistant cartons."
  },
  {
    id: "sustanon-250",
    name: "Sustanon 250",
    subName: "4-Ester Testosterone Blend",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-layer-group",
    packaging: "10ml Vial (250mg/ml) / 1ml Ampoules",
    purity: "Propionate, Phenylprop, Isocaproate, Decanoate",
    description: "Multi-ester blend delivering rapid release alongside long-term physiological hormone maintenance.",
    specs: ["Synergistic 4-Ester Ratio", "Smooth Pharmacokinetic Curve", "WHO-GMP Verified Facility"],
    table: {
      "Active Composition": "Test. Propionate 30mg, Phenylpropionate 60mg, Isocaproate 60mg, Decanoate 100mg",
      "Total Active Hormone": "250 mg / mL",
      "Pharmacopoeia Grade": "BP / EP Standard Blend",
      "Assay Purity": "Conforms to 4-Ester Quantitative Specifications",
      "Carrier Solvent": "Peanut / Sesame Oil, Benzyl Alcohol",
      "Fill Packaging": "10 mL Amber Vial or 1 mL Glass Ampoules",
      "Storage Instructions": "Store at 15°C - 30°C, Do not freeze",
      "Shelf Life": "36 Months",
      "Batch Papers": "Full Finished Product Assay & Microbial Purity COA"
    },
    indications: [
      "Confirmed testosterone deficiency where steady, multi-week physiological coverage is required.",
      "Transgender female-to-male androgenic transition therapy.",
      "Secondary osteoporosis secondary to male hypogonadism."
    ],
    pharmacology: "Sustanon 250 combines four distinct testosterone esters with graduated carbon chain lengths. The propionate provides immediate therapeutic androgen spikes within 24 hours, while the decanoate sustains circulating levels for up to 21 days.",
    handling: "Shipped in rigid foam-lined export boxes ensuring zero breakage during international transit."
  },
  {
    id: "deca-durabolin-250mg",
    name: "Deca-Durabolin 250mg/ml",
    subName: "Nandrolone Decanoate USP",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-syringe",
    packaging: "10ml Multi-Dose Vial (250mg/ml)",
    purity: "Assay 99.1% High Purity",
    description: "Classic long-ester anabolic formulation aiding in collagen synthesis, joint lubrication, and lean muscle synthesis.",
    specs: ["High Nitrogen Retention Ratio", "Therapeutic Joint Relief", "Strict Endotoxin Controls"],
    table: {
      "Active Substance": "Nandrolone Decanoate (250 mg/mL)",
      "CAS Number": "360-70-3",
      "Molecular Formula": "C28H44O3",
      "Pharmacopoeia": "USP / EP Compliant",
      "HPLC Purity": "99.1%",
      "Vehicle": "Sesame Oil with Benzyl Alcohol",
      "Endotoxin Assay": "< 0.5 EU/mg",
      "Storage": "Controlled Room Temperature 15°C - 25°C",
      "Shelf Life": "36 Months",
      "Documentation": "Batch COA, GMP Inspection Compliance Dossier"
    },
    indications: [
      "Management of anemia of renal insufficiency.",
      "Adjuvant therapy in senile and postmenopausal osteoporosis.",
      "Recovery from debilitating chronic illnesses and catabolic wasting."
    ],
    pharmacology: "Nandrolone Decanoate exhibits a high anabolic to androgenic ratio (125:37). It stimulates red blood cell production in the bone marrow, accelerates bone mineral accumulation, and boosts synovial fluid lubrication in articular joints.",
    handling: "Supplied in tamper-evident amber vials with certified leakproof aluminum crimp caps."
  },
  {
    id: "boldenone-undecylenate-300mg",
    name: "Boldenone Undecylenate 300mg/ml",
    subName: "Equipoise Formulation",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-flask",
    packaging: "10ml Multi-Dose Vial (300mg/ml)",
    purity: "HPLC Assay 99.3% Purity",
    description: "Long-acting structural derivative of testosterone providing sustained nitrogen retention, erythropoietin stimulation, and appetite support.",
    specs: ["Extended Undecylenate Ester", "Stimulates Erythropoietin (RBC)", "WHO-GMP Verified Batch"],
    table: {
      "Active Substance": "Boldenone Undecylenate (300 mg/mL)",
      "CAS Number": "13103-34-9",
      "Molecular Formula": "C30H44O3",
      "Grade": "USP Pharmaceutical Raw Material",
      "Assay": "99.3% HPLC Tested",
      "Vehicle": "Sesame Oil, Benzyl Benzoate, Benzyl Alcohol",
      "Container": "10 mL Type-I Tubular Glass Vial",
      "Storage": "15°C - 25°C, Protected from Light",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Debilitating states requiring prolonged tissue-building support.",
      "Severe weight loss following prolonged surgical interventions.",
      "Stimulation of appetite and cellular oxygen-carrying capacity."
    ],
    pharmacology: "Boldenone contains a double bond between carbon 1 and 2, which cuts its rate of aromatization in half compared to testosterone while maintaining high receptor affinity.",
    handling: "Packed with shock-absorbent thermal insulating liners for international flights."
  },
  {
    id: "masteron-100mg",
    name: "Masteron 100mg/ml",
    subName: "Drostanolone Propionate USP",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-dumbbell",
    packaging: "10ml Multi-Dose Vial (100mg/ml)",
    purity: "99.2% Assay Certified",
    description: "Dihydrotestosterone (DHT) derivative with anti-estrogenic properties, used in breast carcinoma protocols and vascular muscle density.",
    specs: ["Inherent Anti-Estrogen Activity", "Rapid Propionate Onset", "High Purity Pharmaceutical Batch"],
    table: {
      "Active Substance": "Drostanolone Propionate (100 mg/mL)",
      "CAS Number": "521-12-0",
      "Molecular Formula": "C23H36O3",
      "HPLC Purity": "99.2%",
      "Appearance": "Clear, Light Yellowish Oil",
      "Vehicle": "Sesame Oil, Benzyl Benzoate, Benzyl Alcohol",
      "Packaging": "10 mL Amber Glass Vial",
      "Storage": "15°C - 25°C",
      "Shelf Life": "24 Months"
    },
    indications: [
      "Palliative treatment of recurrent breast cancer in postmenopausal women.",
      "Advanced oncology androgenic protocol support.",
      "Lean vascular density without water retention."
    ],
    pharmacology: "Drostanolone behaves as a strong anti-estrogen by interacting competitively with estrogen receptors, making it incapable of aromatizing into estrogens.",
    handling: "Packaged in high-grade cartons with hologram authentication seal."
  },
  {
    id: "trenbolone-enanthate-200mg",
    name: "Trenbolone Enanthate 200mg/ml",
    subName: "Trenbolone Enanthate",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-fire",
    packaging: "10ml Multi-Dose Vial (200mg/ml)",
    purity: "Long-Acting Ester 99.4% Purity",
    description: "Extended-release variant of trenbolone for infrequent intramuscular administration with sustained anabolic concentration.",
    specs: ["Long-Acting 7-10 Day Ester", "Fivefold Testosterone Anabolic Index", "Laboratory Batch Tested"],
    table: {
      "Active Substance": "Trenbolone Enanthate (200 mg/mL)",
      "CAS Number": "162983-56-3",
      "Molecular Formula": "C25H34O3",
      "Assay Purity": "99.4% HPLC",
      "Vehicle": "Sesame Oil, Benzyl Benzoate, Benzyl Alcohol 2%",
      "Packaging": "10 mL Multi-Dose Vial",
      "Storage": "15°C - 25°C, Protected from Direct Light",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Severe cachexia and muscle wasting disorders.",
      "High-level protein synthesis and nitrogen balance elevation.",
      "Advanced therapeutic veterinary and research applications."
    ],
    pharmacology: "The enanthate ester allows steady release from the intramuscular depot, maintaining high serum trenbolone levels for 7-10 days per administration.",
    handling: "Shipped in reinforced insulated shipping containers."
  },

  // Page 2: 9 Products (Steroid Orals & Performance Tablets)
  {
    id: "anavar-10mg-50mg",
    name: "Anavar 10mg / 50mg Tablets",
    subName: "Oxandrolone USP Tablets",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-tablets",
    packaging: "100 Tablets / Sealed Bottle",
    purity: "Oral Micronized Oxandrolone",
    description: "Highly tolerated oral compound with low androgenicity, zero water retention, and proven efficacy in tissue repair.",
    specs: ["Low Hepatic Toxicity Profile", "Preserves Lean Muscle Mass", "Available in 10mg & 50mg"],
    table: {
      "Active Substance": "Oxandrolone (10mg or 50mg per tablet)",
      "CAS Number": "53-39-4",
      "Molecular Formula": "C19H30O3",
      "Pharmacopoeia": "USP 43 Standard",
      "Disintegration Time": "< 15 minutes",
      "Assay Purity": "99.5% HPLC",
      "Packaging": "High-Density Polyethylene (HDPE) Bottle of 100 Tablets",
      "Storage": "Store at 20°C - 25°C, Protect from Moisture",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Adjunctive therapy to promote weight gain after extensive surgery or severe trauma.",
      "Offsetting protein catabolism associated with prolonged administration of corticosteroids.",
      "Relief of bone pain accompanying osteoporosis."
    ],
    pharmacology: "Oxandrolone is an oral 17-alpha-alkylated steroid where the second carbon atom has been replaced with an oxygen atom. This unique substitution significantly dampens hepatic metabolism and abolishes estrogenic conversion.",
    handling: "Bottles are sealed with induction foil and desiccants to maintain zero moisture."
  },
  {
    id: "winstrol-10mg-50mg",
    name: "Winstrol 10mg / 50mg Tablets",
    subName: "Stanozolol BP Oral",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-tablets",
    packaging: "100 Tablets / Blister Strip",
    purity: "Pharmaceutical Grade Stanozolol",
    description: "DHT-derived oral steroid optimizing free testosterone levels by binding SHBG and boosting vascular conditioning.",
    specs: ["SHBG Reduction Catalyst", "Zero Progestogenic Activity", "Moisture-Proof Blister Packs"],
    table: {
      "Active Substance": "Stanozolol (10mg / 50mg)",
      "CAS Number": "10418-03-8",
      "Molecular Formula": "C21H32N2O",
      "Pharmacopoeia Standard": "BP / USP",
      "HPLC Assay": "99.1%",
      "Form": "Scored Round Solid Oral Tablet",
      "Packaging": "10x10 ALU-PVC Blister Strips (100 Tablets)",
      "Storage": "15°C - 30°C",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Prophylaxis to decrease the frequency and severity of attacks of hereditary angioedema (HAE).",
      "Stimulation of stromal collagen and red blood cell count.",
      "Metabolic promotion of vascular conditioning."
    ],
    pharmacology: "Stanozolol has a pyrazole ring attached to the A-ring of the steroid nucleus. It strongly decreases serum sex hormone-binding globulin (SHBG), thereby unlocking greater circulating levels of active free hormone.",
    handling: "Exported in moisture-proof blister cartons."
  },
  {
    id: "dianabol-10mg-20mg",
    name: "Dianabol 10mg / 20mg Tablets",
    subName: "Methandienone IP/USP",
    category: "Steroids",
    badgeClass: "badge-steroids",
    icon: "fa-tablets",
    packaging: "100 Tablets / Pack",
    purity: "High Bioavailability Oral Solid",
    description: "Fast-acting oral anabolic steroid designed for rapid protein synthesis and cellular strength enhancement.",
    specs: ["Rapid Anabolic Onset", "Blister Packed for Stability", "Commercial Export Batches"],
    table: {
      "Active Substance": "Methandienone (10mg / 20mg)",
      "CAS Number": "72-63-9",
      "Molecular Formula": "C20H28O2",
      "Pharmacopoeia": "IP / USP Grade",
      "Purity": "99.0%+",
      "Packaging": "100 Tablets per Box (Blister)",
      "Storage": "20°C - 25°C",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Severe catabolic states following extensive burn injuries or cachexia.",
      "Rapid restoration of positive nitrogen balance in debilitated patients."
    ],
    pharmacology: "Methandienone is 17-alpha-methylated and contains a double bond at the 1,2 position. It rapidly crosses the digestive barrier to trigger intracellular ribosomal protein synthesis within hours.",
    handling: "Sealed in blister packs with batch number and expiry printed on each strip."
  },
  {
    id: "vidalista-20-40-60mg",
    name: "Vidalista 20mg / 40mg / 60mg",
    subName: "Tadalafil Tablets USP",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-pills",
    packaging: "10x10 Blister Pack (100 Tablets)",
    purity: "Centurion Laboratories Original",
    description: "Long-acting (36-hour) phosphodiesterase type 5 (PDE5) inhibitor for erectile dysfunction and benign prostatic hyperplasia.",
    specs: ["Up to 36 Hours Therapeutic Window", "High Patient Tolerability", "Available in 20mg, 40mg, 60mg, 80mg"],
    table: {
      "Active Substance": "Tadalafil USP (20mg, 40mg, 60mg, 80mg)",
      "Manufacturer": "Centurion Laboratories Ltd.",
      "CAS Number": "171596-29-5",
      "Molecular Formula": "C22H19N3O4",
      "Pharmacopoeia Standard": "USP 43 Grade",
      "Assay Purity": "99.8% HPLC",
      "Packaging": "10 Tablets per Strip, 10 Strips per Commercial Box",
      "Storage Condition": "Store below 30°C, Protect from Heat and Moisture",
      "Shelf Life": "36 Months from Manufacturing Date"
    },
    indications: [
      "Treatment of erectile dysfunction (ED) in adult males.",
      "Signs and symptoms of benign prostatic hyperplasia (BPH).",
      "Improvement of exercise capacity in pulmonary arterial hypertension (PAH)."
    ],
    pharmacology: "Tadalafil selectively inhibits the enzyme phosphodiesterase type 5 (PDE5). This inhibition enhances the cyclic guanosine monophosphate (cGMP) signaling pathway in smooth muscle cells of the corpus cavernosum, relaxing arterial smooth muscle and promoting sustained hemodynamic blood flow for up to 36 hours.",
    handling: "Direct export boxes with genuine security holographic seals. Exported in shipping cartons of 50 or 100 boxes."
  },
  {
    id: "tadafil-20mg",
    name: "Tadafil 20mg Tablets",
    subName: "Tadalafil Tablets IP 20mg",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-pills",
    packaging: "10x10 Strips Box",
    purity: "WHO-GMP Certified Formulation",
    description: "High-grade therapeutic Tadalafil solid oral dosage providing rapid absorption and sustained circulatory efficiency.",
    specs: ["Consistent Plasma Bioavailability", "Export Standard ALU-ALU Foil", "Batch COA Certified"],
    table: {
      "Active Substance": "Tadalafil IP (20 mg)",
      "Pharmacopoeia": "Indian Pharmacopoeia (IP) / BP",
      "Form": "Film-Coated Oval Yellow Tablet",
      "Assay": "99.5% HPLC",
      "Dissolution": "> 85% in 30 minutes",
      "Packaging": "10 Tablets per ALU-ALU Strip",
      "Storage": "Store at 15°C - 30°C",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Treatment of erectile insufficiency with long-duration therapeutic window.",
      "Daily low-dose microvascular therapy."
    ],
    pharmacology: "Tadafil 20mg inhibits PDE5 without notable inhibition of PDE6 (retinal) or PDE11 (skeletal muscle), ensuring high clinical tolerability and negligible visual side effects.",
    handling: "Packaged in ALU-ALU foil to protect against extreme tropical humidity during international sea or air cargo."
  },
  {
    id: "cenforce-100-150-200mg",
    name: "Cenforce 100mg / 150mg / 200mg",
    subName: "Sildenafil Citrate Tablets USP",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-tablets",
    packaging: "10x10 ALU-ALU Blister (100 Tablets)",
    purity: "Centurion Laboratories Formulation",
    description: "Potent PDE5 inhibitor for prompt erectile enhancement with clinical onset within 30-45 minutes.",
    specs: ["Rapid Onset Formulation", "High Potency 100mg/150mg/200mg", "Global Export Best-Seller"],
    table: {
      "Active Substance": "Sildenafil Citrate USP (equivalent to 100mg, 150mg, 200mg sildenafil)",
      "Manufacturer": "Centurion Laboratories",
      "CAS Number": "171599-83-0",
      "Molecular Formula": "C22H30N6O4S · C6H8O7",
      "Standard": "USP 43 Grade",
      "Assay": "99.6% HPLC",
      "Onset Time": "30 to 45 minutes",
      "Duration": "4 to 6 hours",
      "Packaging": "10 Tablets / Blister Strip, 10 Strips per Box",
      "Storage": "Store below 25°C in a dry place",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Treatment of male erectile dysfunction.",
      "Pulmonary arterial hypertension under specialized medical prescription."
    ],
    pharmacology: "Sildenafil Citrate is a selective cyclic GMP-specific PDE5 inhibitor. By augmenting nitric oxide (NO) action in response to sexual arousal, it elevates local cGMP levels, prompting rapid penile arterial vasodilation.",
    handling: "Supplied in rigid master cartons with full analytical test records for commercial distributors."
  },
  {
    id: "kamagra-100mg",
    name: "Kamagra 100mg Tablets / Oral Jelly",
    subName: "Sildenafil Citrate 100mg",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-pills",
    packaging: "4 Tablets Pack / 7 Sachet Jelly Box",
    purity: "Ajanta Pharma Gold Standard",
    description: "World-renowned brand offering both rapid-absorbing chewable/jelly sachets and film-coated solid oral tablets.",
    specs: ["Ajanta Pharma Genuine Batch", "Assorted Flavors in Jelly Form", "Strict Quality Tested"],
    table: {
      "Active Ingredient": "Sildenafil Citrate (100 mg)",
      "Manufacturer": "Ajanta Pharma Ltd.",
      "Forms Available": "Film-Coated Diamond Green Tablets / Flavored Oral Jelly",
      "Assay Purity": "99.7%",
      "Packaging": "4 Tablets per Blister / 7 x 5g Jelly Sachets per Box",
      "Storage": "Store at 15°C - 30°C",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Fast-acting erectile support where rapid oral absorption is preferred.",
      "Alternative oral jelly for patients with dysphagia (difficulty swallowing pills)."
    ],
    pharmacology: "The oral jelly formulation dissolves quickly on the oral mucosa, entering the systemic bloodstream with an onset of action as rapid as 15-20 minutes.",
    handling: "Genuine Ajanta packaging with laser holographic authenticity marks."
  },
  {
    id: "super-vidalista",
    name: "Super Vidalista",
    subName: "Tadalafil 20mg + Dapoxetine 60mg",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-tablets",
    packaging: "10 Tablets Strip / Box",
    purity: "Dual-Action Synergistic Therapy",
    description: "Combines 36-hour PDE5 inhibition with Dapoxetine serotonin transporter inhibition to prevent premature climax.",
    specs: ["Dual Clinical Efficacy", "Original Centurion Packaging", "Ready Commercial Stock"],
    table: {
      "Composition": "Tadalafil 20 mg + Dapoxetine HCl 60 mg",
      "Manufacturer": "Centurion Laboratories",
      "Therapeutic Category": "PDE5 Inhibitor + Short-Acting SSRI",
      "Assay": "99.5% Combined HPLC Purity",
      "Packaging": "10 Tablets per Strip",
      "Storage": "Store below 25°C, Protected from Direct Light",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Concomitant management of erectile dysfunction and premature ejaculation.",
      "Prolongation of intravaginal ejaculatory latency time (IELT)."
    ],
    pharmacology: "Tadalafil ensures penile arterial engorgement, while Dapoxetine blocks the serotonin reuptake transporter, boosting serotonin action at the postsynaptic cleft and delaying the ejaculatory reflex.",
    handling: "Exported in tamper-sealed export shippers."
  },
  {
    id: "clenbuterol-40mcg",
    name: "Clenbuterol 40mcg Tablets",
    subName: "Clenbuterol Hydrochloride",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-pills",
    packaging: "100 Tablets / Bottle",
    purity: "HPLC Assay 99.2%",
    description: "Potent beta-2 adrenergic agonist used for bronchodilation, respiratory management, and metabolic cellular stimulation.",
    specs: ["High Specificity Beta-2 Agonist", "Micro-Gram Precision Dosing", "Moisture-Proof Export Bottle"],
    table: {
      "Active Substance": "Clenbuterol HCl (40 mcg)",
      "CAS Number": "21898-19-1",
      "Molecular Formula": "C12H18Cl2N2O · HCl",
      "Assay": "99.2%",
      "Form": "White Scored Tablet 40 mcg",
      "Packaging": "100 Tablets per Bottle",
      "Storage": "15°C - 25°C"
    },
    indications: [
      "Reversible airway obstruction in chronic obstructive pulmonary disease (COPD).",
      "Severe bronchial asthma support.",
      "Metabolic activation in clinical research models."
    ],
    pharmacology: "Selectively activates beta-2 receptors in bronchial smooth muscle, producing prompt relaxation, while modestly elevating body temperature and metabolic rate.",
    handling: "Stored in tightly sealed containers."
  },

  // Page 3: 9 Products (Antibiotics, Anti-Estrogens, Capsules & APIs)
  {
    id: "ciprofloxacin-500mg",
    name: "Ciprofloxacin 500mg Tablets",
    subName: "Ciprofloxacin HCl USP",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-shield-virus",
    packaging: "10x10 Blister Pack",
    purity: "Broad-Spectrum Fluoroquinolone",
    description: "Essential systemic antibiotic formulated for severe urinary tract, gastrointestinal, and respiratory bacterial infections.",
    specs: ["WHO-GMP Certified Line", "High Dissolution Rate", "Complete COA Available"],
    table: {
      "Active Ingredient": "Ciprofloxacin Hydrochloride (equivalent to 500mg Ciprofloxacin)",
      "Pharmacopoeia": "USP / BP / IP",
      "Assay": "99.5%",
      "Disintegration": "< 10 minutes",
      "Packaging": "10x10 ALU-ALU or PVC Blister Pack",
      "Storage": "Store below 25°C in a dry place",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Complicated urinary tract infections and pyelonephritis.",
      "Infectious diarrhea caused by Shigella, Salmonella, or Campylobacter.",
      "Respiratory and intra-abdominal multi-bacterial infections."
    ],
    pharmacology: "Inhibits bacterial DNA gyrase and topoisomerase IV, interrupting DNA replication, repair, and transcription, triggering rapid bactericidal cell death.",
    handling: "Bulk air cargo cartons ready with complete analytical export documentation."
  },
  {
    id: "azithromycin-500mg",
    name: "Azithromycin 500mg Tablets",
    subName: "Azithromycin Dihydrate IP",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-capsules",
    packaging: "3 / 6 Tablets Blister Pack",
    purity: "Macrolide Antibiotic IP/BP",
    description: "Broad-spectrum antibacterial medication for upper respiratory infections, bronchitis, and skin infections.",
    specs: ["Convenient Once-Daily Regimen", "High Tissue Penetration", "Export Grade Packing"],
    table: {
      "Active Ingredient": "Azithromycin Dihydrate (equivalent to 500mg Azithromycin)",
      "Standard": "IP / USP Grade",
      "Packaging": "3 or 6 Tablets per Blister",
      "Half-Life": "68 hours",
      "Storage": "Store below 30°C",
      "Shelf Life": "36 Months"
    },
    indications: [
      "Community-acquired pneumonia, acute bacterial sinusitis, pharyngitis.",
      "Skin and soft tissue infections.",
      "Chlamydial and non-gonococcal urethritis."
    ],
    pharmacology: "Binds to the 50S ribosomal subunit of susceptible microorganisms, inhibiting transpeptidation and protein synthesis.",
    handling: "Exported in moisture-barrier blister packs."
  },
  {
    id: "arimidex-1mg",
    name: "Arimidex 1mg Tablets",
    subName: "Anastrozole USP Tablets",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-pills",
    packaging: "28 / 30 Tablets per Pack",
    purity: "99.4% Assay Anti-Aromatase",
    description: "Selective non-steroidal aromatase inhibitor blocking peripheral estrogen synthesis in oncology and hormone protocols.",
    specs: ["Potent Aromatase Enzyme Blockade", "Over 80% Estrogen Reduction", "High Bioavailability"],
    table: {
      "Active Substance": "Anastrozole (1 mg)",
      "CAS Number": "120511-73-1",
      "Molecular Formula": "C17H19N5",
      "Assay": "99.4% HPLC",
      "Packaging": "Blister Pack of 28 / 30 Tablets",
      "Storage": "Store at 20°C - 25°C"
    },
    indications: [
      "Adjuvant treatment of postmenopausal women with hormone receptor-positive early breast cancer.",
      "Control of estrogen-induced side effects (gynecomastia, fluid retention) in androgenic therapy."
    ],
    pharmacology: "Competitively inhibits the aromatase enzyme system in peripheral tissues, reducing circulating estradiol levels by more than 80%.",
    handling: "Shipped in sealed commercial cartons."
  },
  {
    id: "nolvadex-20mg",
    name: "Nolvadex 20mg Tablets",
    subName: "Tamoxifen Citrate USP",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-pills",
    packaging: "10x10 Blister Pack",
    purity: "Selective Estrogen Receptor Modulator",
    description: "SERM that competitively binds estrogen receptors in mammary tissue, widely utilized in oncology and post-cycle recovery.",
    specs: ["Mammary Receptor Antagonist", "Stimulates Pituitary LH/FSH", "WHO-GMP Certified"],
    table: {
      "Active Substance": "Tamoxifen Citrate (equivalent to 20mg tamoxifen)",
      "CAS Number": "54965-24-1",
      "Assay": "99.2%",
      "Packaging": "100 Tablets / Box",
      "Storage": "Store at 15°C - 30°C, Protected from Light"
    },
    indications: [
      "Treatment of metastatic breast cancer.",
      "Restoration of endogenous hypothalamic-pituitary-gonadal axis function."
    ],
    pharmacology: "Competitively inhibits estrogen binding at mammary estrogen receptors, preventing gene transcription of estrogen-dependent growth factors.",
    handling: "Protected by blister foil from light and moisture."
  },
  {
    id: "clomid-50mg",
    name: "Clomid 50mg Tablets",
    subName: "Clomiphene Citrate USP",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-pills",
    packaging: "10x10 Blister Pack",
    purity: "Non-Steroidal Ovulatory & LH Stimulant",
    description: "Selective estrogen receptor modulator stimulating pituitary gonadotropin secretion (LH and FSH) to boost endogenous testosterone.",
    specs: ["Hypothalamic Receptor Antagonist", "Boosts Natural LH and FSH", "Export Ready Batch"],
    table: {
      "Active Substance": "Clomiphene Citrate (50 mg)",
      "CAS Number": "50-41-9",
      "Molecular Formula": "C26H28ClNO · C6H8O7",
      "Assay": "99.3%",
      "Packaging": "10x10 Blister Pack (100 Tablets)",
      "Storage": "Store below 25°C"
    },
    indications: [
      "Treatment of ovulatory dysfunction in females.",
      "Stimulation of Leydig cell testosterone production in male hypogonadism and PCT."
    ],
    pharmacology: "Blocks negative estrogenic feedback at the hypothalamus, resulting in increased pulsatile release of GnRH and subsequent release of LH and FSH from the pituitary.",
    handling: "Moisture-barrier blister packing."
  },
  {
    id: "omeprazole-20mg",
    name: "Omeprazole 20mg Capsules",
    subName: "Omeprazole Gastro-Resistant IP",
    category: "Capsules",
    badgeClass: "badge-capsules",
    icon: "fa-capsules",
    packaging: "10x10 Strip Pack",
    purity: "Enteric-Coated Pellets 20mg",
    description: "Proton pump inhibitor (PPI) decreasing gastric acid secretion for GERD, dyspepsia, and gastric ulcer recovery.",
    specs: ["Acid-Resistant Enteric Coating", "Optimal Gastric Bioavailability", "Stability Tested Packaging"],
    table: {
      "Active Substance": "Omeprazole IP (20 mg as enteric-coated pellets)",
      "Form": "Hard Gelatin Capsule with Enteric Pellets",
      "Standard": "IP / BP / USP",
      "Assay": "99.1%",
      "Packaging": "10x10 ALU-ALU Strip Pack",
      "Storage": "Store in a cool dry place below 25°C"
    },
    indications: [
      "Gastroesophageal reflux disease (GERD) and erosive esophagitis.",
      "Duodenal and gastric ulcers.",
      "Pathological hypersecretory conditions."
    ],
    pharmacology: "Irreversibly inhibits the H+/K+ ATPase enzyme system (proton pump) of gastric parietal cells, shutting down terminal acid secretion.",
    handling: "Hermetically sealed in foil strips."
  },
  {
    id: "doxycycline-100mg",
    name: "Doxycycline 100mg Capsules",
    subName: "Doxycycline Hyclate USP",
    category: "Capsules",
    badgeClass: "badge-capsules",
    icon: "fa-capsules",
    packaging: "10x10 Hard Gelatin Capsules",
    purity: "Tetracycline Class Antibacterial",
    description: "Versatile antimicrobial capsule used in chronic respiratory infections, acne therapy, and prophylactic protocols.",
    specs: ["High Oral Absorption", "Rigid Moisture-Barrier Foil", "Batch COA Certified"],
    table: {
      "Active Substance": "Doxycycline Hyclate (equivalent to 100mg Doxycycline)",
      "Standard": "USP 43 Grade",
      "Assay": "99.4%",
      "Packaging": "10x10 Blister Pack",
      "Storage": "Store below 30°C"
    },
    indications: [
      "Respiratory tract bacterial infections and atypical pneumonias.",
      "Severe acne vulgaris and dermatological infections.",
      "Malaria prophylaxis in international travel."
    ],
    pharmacology: "Inhibits bacterial protein synthesis by binding to the 30S ribosomal subunit, preventing access of aminoacyl-tRNA to the ribosomal acceptor site.",
    handling: "Packed in moisture-proof cartons."
  },
  {
    id: "amoxicillin-clavulanate-625mg",
    name: "Amoxicillin & Clavulanate Potassium 625mg",
    subName: "Amoxicillin 500mg + Clavulanate 125mg",
    category: "Tablets",
    badgeClass: "badge-tablets",
    icon: "fa-pills",
    packaging: "10x6 ALU-ALU Strip Pack",
    purity: "Beta-Lactamase Resistant Formulation",
    description: "Broad-spectrum antibacterial formulation combining an aminopenicillin with a suicide beta-lactamase inhibitor.",
    specs: ["Enhanced Beta-Lactamase Protection", "WHO-GMP Verified Line", "Rigid Tropical Blister Foil"],
    table: {
      "Composition": "Amoxicillin Trihydrate 500mg + Potassium Clavulanate 125mg",
      "Standard": "BP / USP",
      "Packaging": "10x6 Strips Box",
      "Storage": "Store in a cool dry place below 25°C"
    },
    indications: [
      "Upper and lower respiratory tract infections.",
      "Skin, soft tissue, dental, and genitourinary tract bacterial infections."
    ],
    pharmacology: "Amoxicillin inhibits bacterial cell wall synthesis. Clavulanic acid inactivates bacterial beta-lactamase enzymes, preventing amoxicillin degradation.",
    handling: "Special ALU-ALU packaging required to protect moisture-sensitive clavulanate."
  },
  {
    id: "apis-raw-powders",
    name: "Active Pharma Ingredients (APIs)",
    subName: "Pure Raw Pharmaceutical Powders",
    category: "Other Medicines",
    badgeClass: "badge-other",
    icon: "fa-mortar-pestle",
    packaging: "1kg / 5kg / 25kg Sealed Aluminum Drums",
    purity: "HPLC Assay 99.0% - 99.8% Purity",
    description: "Bulk raw materials including Testosterone Enanthate, Tadalafil, Sildenafil, and Nandrolone for licensed compounding laboratories.",
    specs: ["Full Drug Master File (DMF) Ready", "Certificate of Analysis (COA) Included", "Custom Export Cargo Protocols"],
    table: {
      "Available Compounds": "Testosterone Enanthate, Cypionate, Tadalafil, Sildenafil, Trenbolone, Nandrolone",
      "Grade": "USP / EP Pharmaceutical Micronized Raw Powder",
      "Purity Range": "99.0% - 99.8% HPLC Certified",
      "Packaging": "Triple-Bagged in High-Barrier Aluminum Drums (1kg, 5kg, 25kg)",
      "Export Documentation": "Full Drug Master File (DMF), Batch COA, Safety Data Sheet (SDS)",
      "Storage": "Controlled Room Temperature 15°C - 25°C"
    },
    indications: [
      "Manufacturing of finished injectable and solid oral dosage forms in cGMP-certified facilities.",
      "Custom pharmaceutical compounding for clinical hospitals and research."
    ],
    pharmacology: "High-purity crystalline active pharmaceutical bulk materials meeting international pharmacopoeias with strict limits on residual solvents and heavy metals.",
    handling: "Packed under inert nitrogen blanket in tamper-evident sealed aluminum drums."
  }
];

/* ====================================================================
   3. PAGINATION & CATALOG RENDERING ENGINE (9 PRODUCTS PER PAGE)
   ==================================================================== */
const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let activeCategory = 'All';
let currentFilteredList = PRODUCTS;

function renderCurrentPage() {
  const grid = document.getElementById('productsGrid');
  const paginationContainer = document.getElementById('catalogPagination');
  if (!grid) return;

  const totalItems = currentFilteredList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pageItems = currentFilteredList.slice(startIndex, endIndex);

  if (pageItems.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fa-solid fa-box-open text-muted fs-1 mb-3"></i>
        <h5 class="fw-bold" style="color: var(--brand-navy);">No Products Found</h5>
        <p class="text-muted small">Try searching for a different keyword or reset category filter.</p>
        <button class="btn btn-brand-orange mt-2" onclick="filterCatalog('All')">Show All Products</button>
      </div>
    `;
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  // Render exactly 9 items (or remaining on last page)
  grid.innerHTML = pageItems.map(p => `
    <div class="product-card" data-aos="fade-up">
      <div>
        <div class="product-card-header">
          <span class="prod-cat-badge ${p.badgeClass}">${p.category}</span>
          <div class="prod-icon-box">
            <i class="fa-solid ${p.icon}"></i>
          </div>
        </div>

        <!-- CLICKABLE PRODUCT TITLE: OPENS FULL BLOGGER POST -->
        <a href="javascript:void(0)" onclick="openProductPost('${p.id}')" class="product-title-link" title="Click to view full detailed dossier for ${p.name}">
          <h3 class="product-title">${p.name}</h3>
        </a>
        <div class="product-strength">${p.subName}</div>
        <p class="text-muted small mb-3">${p.description}</p>

        <!-- Read Full Post Link -->
        <a href="javascript:void(0)" onclick="openProductPost('${p.id}')" class="read-more-link">
          <i class="fa-solid fa-file-lines me-1"></i> View Full Detailed Post & Specs &rarr;
        </a>

        <ul class="product-specs-list">
          <li><i class="fa-solid fa-circle-check"></i> <strong>Pack:</strong> ${p.packaging}</li>
          <li><i class="fa-solid fa-circle-check"></i> <strong>Purity:</strong> ${p.purity}</li>
          ${p.specs.slice(0, 2).map(s => `<li><i class="fa-solid fa-check"></i> ${s}</li>`).join('')}
        </ul>
      </div>

      <div class="product-actions">
        <a class="btn-prod-wa" href="https://wa.me/918329658863?text=Hello%20RaRe%20Pharma,%20I%20am%20interested%20in%20an%20export%20inquiry%20for%20${encodeURIComponent(p.name)}." target="_blank">
          <i class="fa-brands fa-whatsapp fs-6"></i> Inquire WhatsApp
        </a>
        <button class="btn-prod-quote" type="button" onclick="openQuoteForProduct('${p.name.replace(/'/g, "\\'")}')">
          <i class="fa-solid fa-file-invoice"></i> Quote
        </button>
      </div>
    </div>
  `).join('');

  // Render Numbered Pagination (1, 2, 3...)
  if (paginationContainer) {
    if (totalPages <= 1) {
      paginationContainer.innerHTML = `
        <span class="text-muted small">Showing all ${totalItems} product lines</span>
      `;
    } else {
      let paginationHtml = '';

      // Previous button
      paginationHtml += `
        <button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous Page">
          <i class="fa-solid fa-chevron-left me-1"></i> Prev
        </button>
      `;

      // Page numbers (1, 2, 3...)
      for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
          <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
            ${i}
          </button>
        `;
      }

      // Next button
      paginationHtml += `
        <button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next Page">
          Next <i class="fa-solid fa-chevron-right ms-1"></i>
        </button>
      `;

      paginationHtml += `
        <span class="ms-3 text-muted small d-none d-sm-inline">
          Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong> (${totalItems} Total Formulations)
        </span>
      `;

      paginationContainer.innerHTML = paginationHtml;
    }
  }
}

function goToPage(page) {
  currentPage = page;
  renderCurrentPage();

  // Smoothly scroll to the top of the products catalog
  const section = document.getElementById('posts-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function filterCatalog(category) {
  activeCategory = category;
  currentPage = 1;

  // Ensure catalog view is open if we were viewing a single post
  const singleView = document.getElementById('single-post-view');
  const catalogView = document.getElementById('catalog-main-wrapper');
  if (singleView && catalogView) {
    singleView.style.display = 'none';
    catalogView.style.display = 'block';
  }

  // Update tabs visual active state
  const tabs = document.querySelectorAll('.catalog-tab');
  tabs.forEach(tab => {
    if (tab.innerText.includes(category) || (category === 'All' && tab.innerText.includes('All'))) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Clear search input
  const searchInput = document.getElementById('catalogSearch');
  if (searchInput) searchInput.value = '';

  currentFilteredList = category === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());

  renderCurrentPage();

  // Scroll to catalog section
  const section = document.getElementById('posts-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function searchProducts() {
  const query = (document.getElementById('catalogSearch')?.value || '').toLowerCase().trim();
  currentPage = 1;

  const baseItems = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  if (!query) {
    currentFilteredList = baseItems;
  } else {
    currentFilteredList = baseItems.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.subName.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  renderCurrentPage();
}

/* ====================================================================
   4. FULL DETAILED BLOGGER POST VIEW LOGIC
   ==================================================================== */
function openProductPost(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const catalogView = document.getElementById('catalog-main-wrapper');
  const singleView = document.getElementById('single-post-view');
  const singleContainer = document.getElementById('singlePostContainer');
  const relatedGrid = document.getElementById('relatedProductsGrid');

  if (!catalogView || !singleView || !singleContainer) return;

  // Hide catalog, show single post
  catalogView.style.display = 'none';
  singleView.style.display = 'block';

  // Update breadcrumb
  const breadcrumbCat = document.getElementById('post-breadcrumb-cat');
  const breadcrumbName = document.getElementById('post-breadcrumb-name');
  if (breadcrumbCat) breadcrumbCat.innerText = product.category;
  if (breadcrumbName) breadcrumbName.innerText = product.name;

  // Build specifications table HTML
  const tableRows = Object.entries(product.table || {}).map(([key, val]) => `
    <tr>
      <th>${key}</th>
      <td>${val}</td>
    </tr>
  `).join('');

  // Build indications HTML
  const indicationsList = (product.indications || []).map(item => `
    <li class="mb-2 d-flex align-items-start gap-2">
      <i class="fa-solid fa-circle-check text-success mt-1"></i>
      <span>${item}</span>
    </li>
  `).join('');

  // Populate Single Post Container
  singleContainer.innerHTML = `
    <!-- Post Header -->
    <div class="border-bottom pb-4 mb-4">
      <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
        <span class="prod-cat-badge ${product.badgeClass}">${product.category}</span>
        <span class="badge bg-light text-dark border px-3 py-1 rounded-pill small">
          <i class="fa-solid fa-calendar me-1 text-warning"></i> Export Dossier &copy; 2021
        </span>
        <span class="badge bg-success-subtle text-success border border-success px-3 py-1 rounded-pill small">
          <i class="fa-solid fa-shield-halved me-1"></i> WHO-GMP Validated Batch
        </span>
      </div>

      <h1 class="single-post-title">${product.name} — Technical Dossier & Export Specification</h1>
      <p class="lead text-muted mb-0">${product.subName} | ${product.packaging} | ${product.purity}</p>
    </div>

    <!-- Highlights 4-Grid -->
    <div class="post-highlight-grid">
      <div class="post-highlight-card">
        <div class="h-label">Active Substance</div>
        <div class="h-value">${product.subName}</div>
      </div>
      <div class="post-highlight-card">
        <div class="h-label">HPLC Assay</div>
        <div class="h-value">${product.purity}</div>
      </div>
      <div class="post-highlight-card">
        <div class="h-label">Export Packaging</div>
        <div class="h-value">${product.packaging}</div>
      </div>
      <div class="post-highlight-card">
        <div class="h-label">Quality Standard</div>
        <div class="h-value">USP / BP Pharmacopoeia</div>
      </div>
    </div>

    <!-- Post Body & Detailed Sections -->
    <div class="single-post-body">
      <h3 class="fw-bold mb-3" style="color: var(--brand-navy);"><i class="fa-solid fa-circle-info text-warning me-2"></i> Product Overview & Therapeutic Utility</h3>
      <p>${product.description}</p>
      ${product.pharmacology ? `<p>${product.pharmacology}</p>` : ''}

      <!-- Clinical Indications -->
      <h4 class="fw-bold mt-4 mb-3" style="color: var(--brand-navy);"><i class="fa-solid fa-stethoscope text-warning me-2"></i> Clinical Indications & Approved Applications</h4>
      <ul class="list-unstyled mb-4">
        ${indicationsList}
      </ul>

      <!-- Analytical Specifications Table -->
      <h4 class="fw-bold mt-4 mb-3" style="color: var(--brand-navy);"><i class="fa-solid fa-table-list text-warning me-2"></i> Technical & Analytical Specifications</h4>
      <table class="post-spec-table">
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <!-- Storage & Air Freight Handling -->
      <h4 class="fw-bold mt-4 mb-3" style="color: var(--brand-navy);"><i class="fa-solid fa-snowflake text-warning me-2"></i> Storage, Stability & Cold-Chain Logistics</h4>
      <p>${product.handling || 'Stored at controlled room temperature 15°C - 25°C. Palletized with calibrated thermal indicators and secondary neutral packaging to withstand temperature excursions in international air and ocean transit.'}</p>

      <!-- Action Banner -->
      <div class="post-action-banner">
        <div>
          <h4>Ready to Consign ${product.name}?</h4>
          <p>Contact RaRe Pharma Exim commercial desk for live stock verification, COA documentation, and dispatch scheduling.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <a href="https://wa.me/918329658863?text=Hello%20RaRe%20Pharma,%20I%20am%20inquiring%20about%20a%20consignment%20for%20${encodeURIComponent(product.name)}." target="_blank" class="btn-brand-orange px-4 py-2">
            <i class="fa-brands fa-whatsapp fs-5"></i> Inquire on WhatsApp
          </a>
          <button type="button" class="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" onclick="openQuoteForProduct('${product.name.replace(/'/g, "\\'")}')">
            <i class="fa-solid fa-file-invoice me-1"></i> Request Quote
          </button>
        </div>
      </div>
    </div>
  `;

  // Render 3 Related Products in the same category
  if (relatedGrid) {
    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = related.map(r => `
      <div class="product-card">
        <div>
          <div class="product-card-header">
            <span class="prod-cat-badge ${r.badgeClass}">${r.category}</span>
            <div class="prod-icon-box"><i class="fa-solid ${r.icon}"></i></div>
          </div>
          <a href="javascript:void(0)" onclick="openProductPost('${r.id}')" class="product-title-link">
            <h4 class="product-title fs-5">${r.name}</h4>
          </a>
          <div class="product-strength small">${r.subName}</div>
          <p class="text-muted small mb-2">${r.description.substring(0, 85)}...</p>
        </div>
        <div class="product-actions mt-3">
          <button class="btn btn-sm btn-outline-dark rounded-pill w-100" onclick="openProductPost('${r.id}')">
            View Full Post &rarr;
          </button>
        </div>
      </div>
    `).join('');
  }

  // Smooth scroll to top of post
  singleView.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Update hash
  try {
    history.pushState(null, '', '#post-' + productId);
  } catch (_) {}
}

function closeProductPost() {
  const catalogView = document.getElementById('catalog-main-wrapper');
  const singleView = document.getElementById('single-post-view');

  if (catalogView && singleView) {
    singleView.style.display = 'none';
    catalogView.style.display = 'block';
  }

  // Smooth scroll to catalog section
  const section = document.getElementById('posts-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  try {
    history.pushState(null, '', '#posts-section');
  } catch (_) {}
}

function openQuoteForProduct(productName) {
  const input = document.getElementById('quote_product');
  if (input) {
    input.value = productName;
  }
  const modalEl = document.getElementById('quoteRequestModal');
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

/* ====================================================================
   5. MODAL QUOTE SUBMISSIONS (WHATSAPP & EMAIL)
   ==================================================================== */
function submitQuoteViaWhatsApp() {
  const prod = (document.getElementById('quote_product')?.value || '').trim();
  const name = (document.getElementById('quote_name')?.value || '').trim();
  const contact = (document.getElementById('quote_contact')?.value || '').trim();
  const country = (document.getElementById('quote_country')?.value || '').trim();
  const details = (document.getElementById('quote_details')?.value || '').trim();

  if (!prod || !name || !contact || !country) {
    alert('Please fill out all required fields marked with *');
    return;
  }

  const msg = "Hello RaRe Pharma Exim, here is my Consignment Quote Request:\n\n" +
            "• Requirement/Product: " + prod + "\n" +
            "• Name: " + name + "\n" +
            "• Contact Number: " + contact + "\n" +
            "• Destination Country: " + country + "\n" +
            "• Additional Details: " + (details ? details : "Standard COA & Export Packing");

  window.open("https://wa.me/918329658863?text=" + encodeURIComponent(msg), "_blank");
}

function submitQuoteViaEmail() {
  const prod = (document.getElementById('quote_product')?.value || '').trim();
  const name = (document.getElementById('quote_name')?.value || '').trim();
  const contact = (document.getElementById('quote_contact')?.value || '').trim();
  const country = (document.getElementById('quote_country')?.value || '').trim();
  const details = (document.getElementById('quote_details')?.value || '').trim();

  if (!prod || !name || !contact || !country) {
    alert('Please fill out all required fields marked with *');
    return;
  }

  const subject = encodeURIComponent("Consignment Quote Request: " + prod + " (" + country + ")");
  const body = encodeURIComponent(
    "Hello RaRe Pharma Exim Commercial Desk,\n\n" +
    "Please provide export quotation, batch availability, and delivery timeline for the following:\n\n" +
    "• Requirement / Product: " + prod + "\n" +
    "• Name / Organization: " + name + "\n" +
    "• Contact Number: " + contact + "\n" +
    "• Destination Country: " + country + "\n" +
    "• Additional Regulatory Details: " + (details ? details : "Standard COA & Cold-Chain Logistics") + "\n\n" +
    "Best Regards,\n" + name
  );

  window.location.href = "mailto:rarepharma9@gmail.com?subject=" + subject + "&body=" + body;
}

// Initial Catalog Render & Hash Router
document.addEventListener('DOMContentLoaded', () => {
  renderCurrentPage();

  // Check if URL has a direct product hash
  if (window.location.hash && window.location.hash.startsWith('#post-')) {
    const pId = window.location.hash.replace('#post-', '');
    openProductPost(pId);
  }

  window.addEventListener('popstate', () => {
    if (window.location.hash && window.location.hash.startsWith('#post-')) {
      const pId = window.location.hash.replace('#post-', '');
      openProductPost(pId);
    } else {
      closeProductPost();
    }
  });

  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: false,
      offset: 60,
      duration: 700,
      easing: 'ease-out-cubic'
    });
  }
});
