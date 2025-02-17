import React, { useState } from 'react';
import './index.css';
// import Header from './header';

function Form() {
   const [showAdditionalShippingCost, setShowAdditionalShippingCost] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupTwo, setShowPopupTwo] = useState(false);
  const [formValues, setFormValues] = useState({
    costPrice: '',
    sellingPrice: '',
    gstRate: '',
    discount: '',
    length: '',
    breadth: '',
    height: '',
    measurementDimensions: '',
    percentOrValue: '',
    packingWeight: '',
    weightDimensions: '',
    categoryUnit: '',
    tierUnit: 'Basic',
    shippingOption: '',
    localShippingCost: '',
    regionalShippingCost: '',
    nationalShippingCost: ''
  });
  const [formErrors, setFormErrors] = useState({
    costPrice: null,
    sellingPrice: null,
    gstRate: null,
    discount: null,
    length: null,
    breadth: null,
    height: null,
    measurementDimensions: null,
    percentOrValue: null,
    packingWeight: null,
    weightDimensions: null,
    categoryUnit: null,
    tierUnit: null,
    shippingOption: null,
    localShippingCost: null,
    regionalShippingCost: null,
    nationalShippingCost: null,
  });

  let [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      costPrice: formValues.costPrice,
      sellingPrice: formValues.sellingPrice,
      gstRate: formValues.gstRate,
      discount: formValues.discount,
      length: formValues.length,
      breadth: formValues.breadth,
      height: formValues.height,
      packingWeight: formValues.packingWeight,
      categoryUnit: formValues.categoryUnit,
      tierUnit: formValues.tierUnit,
      shippingOption: formValues.shippingOption,
      localShippingCost: formValues.localShippingCost,
      regionalShippingCost: formValues.regionalShippingCost,
      nationalShippingCost: formValues.nationalShippingCost
    };
    if (formValues.weightDimensions === "kg") {
      payload.packingWeight = (formValues.packingWeight * 1000).toString();
    }

    // discount conversion 
    if (formValues.percentOrValue === "percentValue") {
      payload.discount = (formValues.sellingPrice * formValues.discount / 100).toString();
    }
    if (formValues.measurementDimensions === "inch") {
      payload.length = (formValues.length * 2.54).toString();
      payload.breadth = (formValues.breadth * 2.54).toString();
      payload.height = (formValues.height * 2.54).toString();
    }

    if (formValues.shippingOption === "Easy Ship Prime") {
      payload.shippingOption = "Easy Ship";
    }
    try {
      const response = await fetch(`https://marginanalyse.azurewebsites.net/api/marginv1?costPrice=${payload.costPrice}&sellingPrice=${payload.sellingPrice}&gstRate=${payload.gstRate}&discount=${payload.discount}&length=${payload.length}&breadth=${payload.breadth}&height=${payload.height}&packingWeight=${payload.packingWeight}&categoryUnit=${payload.categoryUnit}&tierUnit=${payload.tierUnit}&shippingOption=${payload.shippingOption}&localShippingCost=${payload.localShippingCost}&regionalShippingCost=${payload.regionalShippingCost}&nationalShippingCost=${payload.nationalShippingCost}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // Parse the JSON response
      console.log(payload)
      console.log(data);
      console.log(payload);
      formData = data;
    } catch (error) {
      console.log(error);
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitted(true);
    const target = document.getElementById('tableWrapper');
    target.scrollIntoView({ behavior: 'smooth' });

  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "costPrice" && value <= 0)|| (name=== "sellingPrice" && value <= 0)||(name=== "length" && value <= 0)||(name=== "breadth" && value <= 0)|| (name=== "height" && value <= 0)||(name=== "packingWeight" && value <= 0)||(name=== "discount" && value < 0)) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
          if(formValues.percentOrValue==="percentValue" && (name==="discount"&& value>80)){
      setShowPopupTwo(true);
    }
    else{
      setShowPopupTwo(false);
    }
  
    setFormValues({
      ...formValues,
      [name]: value,
    });


    if (name === "shippingOption") {
      setShowAdditionalShippingCost(value === "Easy Ship" || value === "Easy Ship Prime");
    }
    // if (name === "shippingOption" && formValues.shippingOption === "Easy Ship Prime") {
    //   [easyShipPrimeTable, seteasyShipPrimeTable] = true;
    // }



    if ((name === "sellingPrice" && value <= 80) || (Number(formValues.costPrice) <= 0) || (Number(formValues.packingWeight) <= 0) || (Number(formValues.breadth)) || (Number(formValues.length)) || (Number(formValues.height))) {
      setFormErrors({
        ...formErrors,
        sellingPrice: "Selling price must be greater than 80",
      });
    } else {
      setFormErrors({
        ...formErrors,
        sellingPrice: null,
      });
    }

  };

  const handleCancel = () => {
 setShowPopup(false);
setShowPopupTwo(false);
  };
  return (
    <div>
      <div className='productName'>
        <h1 className='productDetails'>Product Information</h1>
      </div>
      <form onSubmit={handleSubmit} className='product-form'>
        <div className='formFields'>
          <label className='inputLabels' >Product Cost Price <br /> <p className='sidep'>Excluding GST</p></label>
          <div className=''>
            <input className='product-form-input' type="text" id="costPrice" name="costPrice" value={formValues.costPrice} placeholder="&#8377;" onChange={handleChange} required />
          </div>
        </div>
        <div className='formFields'>
          <label className='inputLabels' >Product Selling Price <br /> <p className='sidep'>Including GST</p></label>
          <div className=''>
            <input className='product-form-input' type="text" id="sellingPrice" name="sellingPrice" value={formValues.sellingPrice} placeholder="&#8377;" onChange={handleChange} required />
          </div>
        </div>
        <br></br>
        <div className='gst-col'>
          <div className='formFields'>
            <label className='inputLabels' >Product GST <br /> <p className='sidep'>GST Rate</p></label>
            <div className=''>
              <select className='' id="gstValues" name="gstRate" value={formValues.gstRate} onChange={handleChange} required>
                <option value="0.00">0%</option>
                <option value="0.05">5%</option>
                <option value="0.12">12%</option>
                <option value="0.18">18%</option>
                <option value="0.28">28%</option>
              </select>
            </div>
          </div>
        </div>
        <div className='formFields'>
          <label className='inputLabels' >Discount on Selling Price<br /> <p className='sidep'>Enter Percentage or value</p></label>
          <div className='one'>
            <div>
              <select className='' id='percentOrValue'
                value={formValues.percentOrValue}
                onChange={handleChange}
                name="percentOrValue"
                required
              >
                <option value="absoulteValue">value</option>
                <option value="percentValue">%</option>
              </select>
              <input className='product-form-input-2' type="text" id="discount" name="discount" value={formValues.discount} placeholder="&#8377;" onChange={handleChange} required />
            </div>
          </div>
        </div>
        <div className='formFields'>
          <label className='inputLabels' >Packaging Dimensions<br /> <p className='sidep'>Length, Width & Height</p></label>
          <div className='two'>
          <select className='' id='measurementDimensions'
                value={formValues.measurementDimensions}
                onChange={handleChange}
                name="measurementDimensions"
                required
              >
                <option value="cm">cm</option>
                <option value="inch">inch</option>
              </select>
            <label className='form-label'>L </label>
            <input className='product-form-input-3' type="number" id="length" name="length" value={formValues.length} placeholder="" onChange={handleChange} required />
            <label className='form-label'>W </label>
            <input className='product-form-input-3' type="number" id="breadth" name="breadth" value={formValues.breadth} placeholder="" onChange={handleChange} required />
            <label className='form-label'>H </label>
            <input className='product-form-input-end' type="number" id="height" name="height" value={formValues.height} placeholder="" onChange={handleChange} required />
          </div>
        </div>
        <div className='formFields'>
          <label className='inputLabels'>Packaging Weight<br /> <p className='sidep'>Nett Weight</p></label>
          <div className='one'>
            <div>
              <select className='' id='weightDimensions'
                value={formValues.weightDimensions}
                onChange={handleChange}
                name="weightDimensions"
                required
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
              </select>
              <input className='product-form-input-2' type="text" id="packingWeight" name="packingWeight" value={formValues.packingWeight} placeholder="" onChange={handleChange} required />
            </div>
          </div>
        </div>
        <div className='formFields'>
          <label className='inputLabels'>Amazon Product Category<br /> <p className='sidep'>Select Category</p></label>
          <div className=''>
            <select className='' id="categoryUnit" name="categoryUnit" value={formValues.categoryUnit} onChange={handleChange} required>
              <option value="">Select Product Category</option>
              <option value="Books">Books</option>
              <option value="Movies">Movies</option>     
              <option value="Software products">Software products</option>
              <option value="School Textbook Bundles">School Textbook Bundles</option>
              <option value="Music">Music</option>
              <option value="Video Games - Consoles">Video Games - Consoles</option>
              <option value="Video Games - Accessories">Video Games - Accessories</option>
              <option value="Video Games - Online game services">Video Games - Online game services</option>
              <option value="Video Games - Other Products">Video Games - Other Products</option>
              <option value="Toys - Other Products">Toys - Other Products</option>
              <option value="Toys - Drones">Toys - Drones</option>
              <option value="Toys - Balloons and Soft Toys">Toys - Balloons and Soft Toys</option>
              <option value="Pet - Other Products">Pet - Other Products</option>
              <option value="Beauty - Haircare, Bath and Shower">Beauty Haircare, Bath and Shower</option>
              <option value="Beauty - Make-up">Beauty - Make-up</option>
              <option value="Beauty - Other Products">Beauty - Other Products</option>
              <option value="Deodorants">Deodorants</option>
              <option value="Facial Steamers">Facial Steamers</option>
              <option value="Beauty - Fragrance">Beauty - Fragrance</option>
              <option value="Luxury Beauty">Luxury Beauty</option>
              <option value="Health and Personal Care - Medical Equipment">Health and Personal Care - Medical Equipment</option>
              <option value="Health and Personal Care - Nutrition">Health and Personal Care - Nutrition</option>
              <option value="Health and Personal Care - Ayurvedic products, Oral care, hand sanitisers, Pooja supplies">Health and Personal Care - Ayurvedic products, Oral care, hand sanitisers, Pooja supplies</option>
              <option value="Health and Personal Care - Other household supplies">Health and Personal Care - Other household supplies</option>
              <option value="Health and Personal Care - Contact lens and reading glasses">Health and Personal Care - Contact lens and reading glasses</option>
              <option value="Health and Personal Care - Other Products">Health and Personal Care - Other Products</option>
              <option value="Baby Hardlines">Baby Hardlines</option>     
              <option value="Grocery and Gourmet - Other Products">Grocery and Gourmet - Other Products</option>
              <option value="Grocery and Gourmet - Hampers and gifting">Grocery and Gourmet - Hampers and gifting</option>
              <option value="Weighing Scales & Fat Analysers">Weighing Scales & Fat Analysers</option>
              <option value="Pharmacy - Prescription Medicines">Pharmacy - Prescription Medicines</option>
              <option value="Personal Care Appliances - Grooming and Styling">Personal Care Appliances - Grooming and Styling</option>
              <option value="Personal Care Appliances - Electric Massagers">Personal Care Appliances - Electric Massagers</option>
              <option value="Personal Care Appliances - Glucometer and Glucometer Strips">Personal Care Appliances - Glucometer and Glucometer Strips</option>
              <option value="Personal Care Appliances - Thermometers">Personal Care Appliances - Thermometers</option>
              <option value="Personal Care Appliances - Other Products">Personal Care Appliances - Other Products</option>
              <option value="Apparel - Sarees & Dress Materials">Apparel - Sarees & Dress Materials</option>
              <option value="Apparel - Sweat Shirts and Jackets">Apparel - Sweat Shirts and Jackets</option>
              <option value="Apparel - Other Innerwear">Apparel - Other Innerwear</option>
              <option value="Apparel - Women's Innerwear and Lingerie">Apparel - Women's Innerwear and Lingerie</option>
              <option value="Apparel - Men's T-Shirts (Excluding Tank Tops and Full Sleeve Tops)">Apparel - Men's T-Shirts (Excluding Tank Tops and Full Sleeve Tops)</option>
              <option value="Apparel - Sleepwear">Apparel - Sleepwear</option>
              <option value="Apparel - Accessories">Apparel - Accessories</option>
              <option value="Apparel - Ethnic Wear">Apparel - Ethnic Wear</option>
              <option value="Apparel - Baby">Apparel - Baby</option>
              <option value="Apparel - Shorts">Apparel - Shorts</option>
              <option value="Apparel - Other Products">Apparel - Other Products</option>
              <option value="Eyewear - Sunglasses, Frames and Zero Power Eye Glasses">Eyewear - Sunglasses, Frames and Zero Power Eye Glasses</option>
              <option value="Watches">Watches</option>
              <option value="Fashion Smartwatches">Fashion Smartwatches</option>
              <option value="Shoes">Shoes</option>
              <option value="Flip Flops, Fashion Sandals and Slippers">Flip Flops, Fashion Sandals and Slippers</option>
              <option value="Kids Shoes">Kids Shoes</option>
              <option value="Handbags">Handbags</option>
              <option value="Wallets">Wallets</option>
              <option value="Backpacks">Backpacks</option>
              <option value="Luggage - Suitcase & Trolleys">Luggage - Suitcase & Trolleys</option>
              <option value="Luggage - Travel Accessories">Luggage - Travel Accessories</option>
              <option value="Luggage - Other Products">Luggage - Other Products</option>
              <option value="Fashion Jewellery">Fashion Jewellery</option>
              <option value="Silver Jewellery">Silver Jewellery</option>
              <option value="Silver Coins and Bars">Silver Coins and Bars</option>
              <option value="Fine Jewellery - Unstudded and Solitaire)">Fine Jewellery - Unstudded and Solitaire</option>
              <option value="Fine Jewellery - Studded">Fine Jewellery - Studded</option>
              <option value="Fine Jewellery - Gold Coins)">Fine Jewellery - Gold Coins</option>
              <option value="Kitchen Tools & Supplies - Choppers, Knives, Bakeware & Accessories">Kitchen Tools & Supplies - Choppers, Knives, Bakeware & Accessories</option>
              <option value="Gas Stoves and Pressure Cookers">Gas Stoves and Pressure Cookers</option>
              <option value="Cookware, Tableware & Dinnerware">Cookware, Tableware & Dinnerware</option>
              <option value="Kitchen - Glassware & Ceramicware">Kitchen - Glassware & Ceramicware</option>
              <option value="Kitchen - Other Products">Kitchen - Other Products</option>
              <option value="Small Appliances">Small Appliances</option>
              <option value="Fans and Robotic Vacuums">Fans and Robotic Vacuums</option>
              <option value="Wall Art">Wall Art</option>
              <option value="Home Fragrance and Candles">Home Fragrance and Candles</option>
              <option value="Home furnishing">Home furnishing</option>
              <option value="Carpets, Bedsheets, Blankets and covers">Carpets, Bedsheets, Blankets and covers</option>
              <option value="Containers, Boxes, Bottles and Kitchen Storage">Containers, Boxes, Bottles and Kitchen Storage</option> 
              <option value="Home Storage (Excluding Kitchen Containers, Boxes, Bottles and Kitchen Storage">Home Storage (Excluding Kitchen Containers, Boxes, Bottles and Kitchen Storage)</option>
              <option value="Home - Waste and Recycling">Home - Waste and Recycling</option>
              <option value="Home - Other Products">Home - Other Products</option>
              <option value="Craft Materials">Craft Materials</option>
              <option value="Wallpapers & Wallpaper Accessories">Wallpapers & Wallpaper Accessories</option>
              <option value="Home Improvement Accessories">Home Improvement Accessories</option>
              <option value="Safes and Lockers with Locking Mechanism">Safes and Lockers with Locking Mechanism</option>
              <option value="Home improvement - Kitchen & Bath, Cleaning Supplies, Paints, Electricals, Hardware, Building Materials">Home improvement - Kitchen & Bath, Cleaning Supplies, Paints, Electricals, Hardware, Building Materials </option>
              <option value="Ladders">Ladders</option>
              <option value="Home Safety & Security Systems">Home Safety & Security Systems</option>
              <option value="Home Improvement - Other Products">Home Improvement - Other Products</option>
              <option value="Indoor Lighting - Wall, ceiling fixture lights, lamp bases, lamp shades and Smart Lighting">Indoor Lighting - Wall, ceiling fixture lights, lamp bases, lamp shades and Smart Lighting</option>
              <option value="LED Bulbs and Battens">LED Bulbs and Battens</option>
              <option value="Indoor Lighting - Other Products">Indoor Lighting - Other Products</option>
              <option value="Clocks">Clocks</option>
              <option value="Cushion Covers">Cushion Covers</option>
              <option value="Slipcovers and Kitchen Linens">Slipcovers and Kitchen Linens</option>
              <option value="Lawn & Garden - Commercial Agricultural Products">Lawn & Garden - Commercial Agricultural Products</option>
              <option value="Lawn & Garden - Solar Devices, Panels, Inverters, Charge controller, Battery, Lights, Solar gadgets">Lawn & Garden - Solar Devices, Panels, Inverters, Charge controller, Battery, Lights, Solar gadgets</option>
              <option value="Lawn & Garden - Chemical Pest Control, Mosquito nets, Bird control, Plant protection, Foggers">Lawn & Garden - Chemical Pest Control, Mosquito Netts, Bird control, Plant protection, Foggers</option>
              <option value="Lawn and Garden - Outdoor Equipment">Lawn and Garden - Outdoor Equipment</option>
              <option value="Lawn and Garden - Other Products">Lawn and Garden - Other Products</option>
              <option value="Lawn and Garden - Plants, Seeds, Bulbs and Gardening Tools">Lawn and Garden - Plants, Seeds, Bulbs and Gardening Tools</option>
              <option value="Automotive - Tyres & Rims">Automotive - Tyres & Rims</option>
              <option value="Automotive - Helmets, Oils and Lubricants, Batteries, Pressure Washer, Vacuum Cleaner, Air Freshener, Air Purifiers, Vehicle Tools">Automotive - Helmets, Oils and Lubricants, Batteries, Pressure Washer, Vacuum Cleaner, Air Freshener, Air Purifiers, Vehicle Tools</option>
              <option value="Automotive Accessories - Floor Mats, Seat, Car, Bike Covers">Automotive Accessories - Floor Mats, Seat/Car/Bike Covers</option>
              <option value="Automotive Vehicles - 2-Wheelers, 4-Wheelers and Electric Vehicle">Automotive Vehicles - 2-Wheelers, 4-Wheelers and Electric Vehicle</option>
              <option value="Automotive - Car and Bike parts, Brakes, Styling and Body Fittings, Transmission, Engine parts, Exhaust Systems, Interior Fitting, Suspension, Wipers">Automotive - Car and Bike parts, Brakes, Styling and Body Fittings, Transmission, Engine parts, Exhaust Systems, Interior Fitting, Suspension, Wipers</option>
              <option value="Automotive - Cleaning Kits, Sponges, Brush, Duster, Cloths and Liquids, Car Interior and Exterior Care, Waxes, Polish, Shampoo, Car and Bike, Lighting and Paints">Automotive - Cleaning Kits, Sponges, Brush, Duster, Cloths and Liquids, Car Interior and Exterior Care, Waxes, Polish, Shampoo, Car and Bike, Lighting and Paints</option>
              <option value="Automotive - Other Products">Automotive - Other Products</option>
              <option value="Major Appliances Accessories">Major Appliances Accessories</option>
              <option value="Major Appliances - Chimneys">Major Appliances - Chimneys</option>
              <option value="Major Appliances - Refrigerators">Major Appliances - Refrigerators</option>
              <option value="Major Appliances - Other Products">Major Appliances - Other Products</option>
              <option value="Mattresses">Mattresses</option>
              <option value="Furniture - Other Products">Furniture - Other Products</option>
              <option value="Bean Bags & Inflatables">Bean Bags & Inflatables</option>
              <option value="Business and Industrial Supplies - Scientific Supplies">Business and Industrial Supplies - Scientific Supplies</option>
              <option value="Business and Industrial Supplies - Electrical Testing, Dimensional Measurement, 3D Printer, Thermal Printers, Barcode Scanners">Business and Industrial Supplies - Electrical Testing, Dimensional Measurement, 3D Printer, Thermal Printers, Barcode Scanners</option>
              <option value="Business & Industrial Supplies - Commercial, Food Handling Equipment, and Health Supplies"> Business & Industrial Supplies - Commercial, Food Handling Equipment, and Health Supplies</option>
              <option value="Business and Industrial Supplies - Hand and Power Tools">Business and Industrial Supplies - Hand and Power Tools</option>
              <option value="Business & Industrial Supplies - Other Products">Business & Industrial Supplies - Other Products</option>
              <option value="Bicycles">Bicycles</option>
              <option value="Gym equipments">Gym equipments</option>
              <option value="Sports - Footwear">Sports - Footwear</option>
              <option value="Sports Collectibles">Sports Collectibles</option>
              <option value="Sports - Cricket & Badminton Equipments, Tennis, Table Tennis, Squash, Football, Volleyball, Basketball, Throwball, Swimming">Sports - Cricket & Badminton Equipments, Tennis, Table Tennis, Squash, Football, Volleyball, Basketball, Throwball, Swimming</option>
              <option value="Sports - Other Products">Sports - Other Products</option>
              <option value="Consumable Physical Gift Card">Consumable Physical Gift Card</option>
              <option value="Entertainment Collectibles">Entertainment Collectibles</option>
              <option value="Coins Collectibles">Coins Collectibles</option>
              <option value="Fine Art">Fine Art</option>
              <option value="Masks">Masks</option>
              <option value="Mobile Phones">Mobile Phones</option>
              <option value="Tablets">Tablets</option>
              <option value="Laptops">Laptops</option>
              <option value="Scanners & Printers">Scanners & Printers</option>
              <option value="PC Components - RAM & Motherboards">PC Components - RAM & Motherboards</option>
              <option value="Desktops">Desktops</option>
              <option value="Monitors">Monitors</option>
              <option value="Laptop & Camera Battery">Laptop & Camera Battery</option>
              <option value="Laptop Bags & Sleeves">Laptop Bags & Sleeves</option>
              <option value="USB Flash Drives - Pen Drives">USB Flash Drives - Pen Drives</option>
              <option value="Hard Disks">Hard Disks</option>
              <option value="Kindle Accessories">Kindle Accessories</option>
              <option value="Memory Cards">Memory Cards</option>
              <option value="Modems & Networking Devices">Modems & Networking Devices</option>
              <option value="Car Electronics Devices">Car Electronics Devices</option>
              <option value="Car Electronics Accessories">Car Electronics Accessories</option>
              <option value="Electronic Devices (Excluding TV, Camera & Camcorder, Camera Lenses & Accessories, GPS Devices, Speakers)">Electronic Devices (Excluding TV, Camera & Camcorder, Camera Lenses & Accessories, GPS Devices, Speakers)</option>
              <option value="Landline Phones">Landline Phones</option>
              <option value="Smart Watches & Accessories">Smart Watches & Accessories</option>
              <option value="Television">Television</option>
              <option value="Camera & Camcorder">Camera & Camcorder</option>
              <option value="Camera Lenses">Camera Lenses</option>
              <option value="Camera Accessories">Camera Accessories</option>
              <option value="GPS Devices">GPS Devices</option>
              <option value="Speakers">Speakers</option>
              <option value="Headsets, Headphones & Earphones">Headsets, Headphones & Earphones</option>
              <option value="Computer & Laptop - Keyboards & Mouse">Computer & Laptop - Keyboards & Mouse</option>
              <option value="Power Banks & Chargers">Power Banks & Chargers</option>
              <option value="Accessories - Electronics, PC & Wireless">Accessories - Electronics, PC & Wireless</option>
              <option value="Cases, Covers, Skins & Screen Guards">Cases, Covers, Skins & Screen Guards</option>
              <option value="Cables & Adapters - Electronics, PC, Wireless">Cables & Adapters - Electronics, PC, Wireless</option>
              <option value="Car Cradles, Lens Kits & Tablet Cases">Car Cradles, Lens Kits & Tablet Cases</option>
              <option value="Warranty Services">Warranty Services</option>
              <option value="Office - Electronic Devices">Office - Electronic Devices</option>
              <option value="Office - Other Products">Office - Other Products</option>
              <option value="Projectors, Home Theatre Systems, Binoculars and Telescopes">Projectors, Home Theatre Systems, Binoculars and Telescopes</option>
              <option value="Musical Instruments - Guitars">Musical Instruments - Guitars</option>
              <option value="Musical Instruments - Keyboards">Musical Instruments - Keyboards</option>
              <option value="Musical Instruments - DJ and VJ Equipment, Recording and Computer, Cables and Leads, Microphones, PA and Stage">Musical Instruments - DJ and VJ Equipment, Recording and Computer, Cables and Leads, Microphones, PA and Stage</option>
              <option value="Musical Instruments - Other Products">Musical Instruments - Other Products</option>
            </select>
          </div>
        </div>
        <div className='formFields'>
          <label className='inputLabels'>Amazon Seller Tier<br /> <p className='sidep'>STEP Tier</p></label>
          <div className=''>
            <select className='' id="tierUnit" name="tierUnit" value={formValues.tierUnit} onChange={handleChange} required>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>
        <div className='formFields'>
          <label className='inputLabels'> Shipping Methods<br /><p className='sidep'>Select Shipping Methods</p> </label>
          <div className='radio'>
            <div>
              <input className='radio-item'
                type="radio"
                name="shippingOption"
                value="Self Ship"
                checked={formValues.shippingOption === "Self Ship"}
                onChange={handleChange}
 required
              />
              <label className="shipmentOptions" htmlFor="Self Ship">Self ship</label>
            </div>
            <div>
              <input className='radio-item'
                type="radio"
                name="shippingOption"
                value="Easy Ship"
                checked={formValues.shippingOption === "Easy Ship"}
                onChange={handleChange}
 required
              />
              <label className="shipmentOptions" htmlFor='easyshipprime'>Easy Ship</label>
            </div>
            <div>

              <input className='radio-item'
                type="radio"
                name="shippingOption"
                value="FBA"
                checked={formValues.shippingOption === "FBA"}
                onChange={handleChange}
 required
              />
              <label className="shipmentOptions" htmlFor='FBA'>FBA</label>
            </div>
            <div >
              <input className='radio-item'
                type="radio"
                name="shippingOption"
                value="Easy Ship Prime"
                checked={formValues.shippingOption === "Easy Ship Prime"}
                onChange={handleChange}
 required
              />
              <label className="shipmentOptions" htmlFor='easyship'>Easy Ship Prime</label>
            </div>
            <div>
              <input className='radio-item'
                type="radio"
                name="shippingOption"
                value="Seller Flex"
                checked={formValues.shippingOption === "Seller Flex"}
                onChange={handleChange}
 required
              />
              <label htmlFor='sellerflex'>Seller Flex</label>
            </div>
          </div>

        </div>

        {
          showAdditionalShippingCost ? (
            <div id='additionalShippingCost' className='additionalShippingCost'>

              {/* <div className='titles'>
                <p className='para'>Local</p>
                <p className='para'>Regional</p>
                <p className='para'>National</p>
              </div> */}
              <div className='formFields'>
                <label className='inputLabels'> Additional Shipping Costs <br /> <p className='sidep'>Seller Shipping Cost If Any</p> </label>
                <div className='four'>
                  <div className='three'>
                    <div>
                      <label className='ship'>Local</label>
                      <div>
                        <input className='product-form-inputs-5'
                          name="localShippingCost"
                          type="number"
                          placeholder="&#8377;"
                          value={formValues.localShippingCost}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className='ship'>Regional</label>
                    <div>
                      <input className='product-form-inputs-5'
                        name="regionalShippingCost"
                        type="number"
                        placeholder="&#8377;"
                        value={formValues.regionalShippingCost}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className='ship'>National</label>
                    <div>
                      <input className='product-form-inputs-5'
                        name="nationalShippingCost"
                        type="number"
                        placeholder="&#8377;"
                        value={formValues.nationalShippingCost}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>



          ) : null
        }
        <button type="submit" className='submitButton'>Generate Margin Analysis</button>
      </form >
      {showPopup && (
  <div className="popup">
    <p className='error-msg'>Please enter a valid input. The allowed values are positive integers</p>
    <button className='cancel-btn'  onClick={handleCancel}> Cancel</button>
  </div>
)}
      {showPopupTwo && (
  <div className="popup">
    <p className='error-msg'>Please enter a valid input. The allowed discount range is from 1% to 80%</p>
    <button className='cancel-btn'  onClick={handleCancel}> Cancel</button>
  </div>
)}
      <div>
        {submitted &&
          <div className='tableWrapper' id='tableWrapper'>
            {formValues.shippingOption !== "Easy Ship Prime" &&
              <p className='tableHeading'><b>Amazon Margin Analysis for {formValues.shippingOption} Order </b></p>}
            {formValues.shippingOption === "Easy Ship Prime" &&
              <p className='tableHeading'><b>Amazon Margin Analysis for Easy Ship Prime Express Orders by All Customers</b></p>}
            <div>
              <table className="tableTwo ">
                <thead className='tableHeader'>
                  <tr>
                    <th className='table-title'>Item</th>
                    <th className='table-title'>Local</th>
                    <th className='table-title'>Regional</th>
                    <th className='table-title'>National</th>
                    <th className='table-title'>Average</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tableTwoRow1">
                  </tr>
                  <tr className="tableTwoRow2">
                    <td>Item Selling Price</td>
                    <td><span>&#8377;</span>{formData.item_selling_price_local}</td>
                    <td><span>&#8377;</span>{formData.item_selling_price_regional}</td>
                    <td><span>&#8377;</span>{formData.item_selling_price_national}</td>
                    <td><span>&#8377;</span>{formData.Average_selling_price}</td>
                  </tr>
                  <tr className="tableTwoRow3">
                    <td>Nett Settlement</td>
                    <td><span>&#8377;</span>{formData.Nett_Settlment_Local}</td>
                    <td><span>&#8377;</span>{formData.Nett_Settlment_Regional}</td>
                    <td><span>&#8377;</span>{formData.Nett_Settlment_National}</td>
                    <td><span>&#8377;</span>{formData.Average_net_settlement}</td>
                  </tr>
                  <tr className="tableTwoRow5">
                    <td>Margin on SP</td>
                    <td>{formData.Margin_on_sp_local}%</td>
                    <td>{formData.Margin_on_sp_regional}%</td>
                    <td>{formData.Margin_on_sp_national}%</td>
                    <td>{formData.Average_margin_on_sp}%</td>
                  </tr>
                  <tr className="tableTwoRow6">
                    <td>Margin on Settlement</td>
                    <td>{formData.margin_on_settlement_local}%</td>
                    <td>{formData.margin_on_settlement_regional}%</td>
                    <td>{formData.margin_on_settlement_national}%</td>
                    <td>{formData.average_margin_on_settlement}%</td>
                  </tr>
                  <tr className="tableTwoRow6">
                    <td>Profit</td>
                    <td><span>&#8377;</span>{formData.Profit_local}</td>
                    <td><span>&#8377;</span>{formData.Profit_regional}</td>
                    <td><span>&#8377;</span>{formData.Profit_national}</td>
                    <td><span>&#8377;</span>{formData.Average_profit}</td>
                  </tr>

                </tbody>
              </table>

            </div>
          </div>

        }
      </div>
      {submitted && formValues.shippingOption === "Easy Ship Prime" &&
        <div>
          <p className='tableHeading'><b>Amazon Margin Analysis for Easy Ship Prime Express Orders by Non Prime Customers</b></p>
          <div className='tableWrapper'>
            <div>
              <table className="tableTwo ">
                <thead className='tableHeader'>
                  <tr>
                    <th>Item</th>
                    <th>Local</th>
                    <th>Regional</th>
                    <th>National</th>
                    <th>Average</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tableTwoRow1">
                  </tr>
                  <tr className="tableTwoRow2">
                    <td>Item Selling Price</td>
                    <td><span>&#8377;</span>{formData.item_selling_price_local}</td>
                    <td><span>&#8377;</span>{formData.item_selling_price_regional}</td>
                    <td><span>&#8377;</span>{formData.item_selling_price_national}</td>
                    <td><span>&#8377;</span>{formData.Average_selling_price}</td>

                  </tr>
                  <tr className="tableTwoRow3">
                    <td>Nett Settlement</td>
                    <td><span>&#8377;</span>{formData.non_prime_net_settlement_local}</td>
                    <td><span>&#8377;</span>{formData.non_prime_net_settlement_regional}</td>
                    <td><span>&#8377;</span>{formData.non_prime_net_settlement_national}</td>
                    <td><span>&#8377;</span>{formData.Average_non_prime_net_settlement}</td>



                  </tr>
                  <tr className="tableTwoRow5">
                    <td>Margin on SP</td>
                    <td>{formData.non_prime_margin_on_selling_price_local}%</td>
                    <td>{formData.non_prime_margin_on_selling_price_regional}%</td>
                    <td>{formData.non_prime_margin_on_selling_price_national}%</td>
                    <td>{formData.non_prime_average_margin_on_sp}%</td>

                  </tr>
                  <tr className="tableTwoRow6">
                    <td>Margin on Settlement</td>
                    <td>{formData.non_prime_margin_on_settlement_local}%</td>
                    <td>{formData.non_prime_margin_on_settlement_regional}%</td>
                    <td>{formData.non_prime_margin_on_settlement_national}%</td>
                    <td>{formData.non_prime_average_margin_on_settlement}%</td>

                  </tr>
                  <tr className="tableTwoRow6">
                    <td>Profit</td>
                    <td><span>&#8377;</span>{formData.non_prime_profit_local}</td>
                    <td><span>&#8377;</span>{formData.non_prime_profit_regional}</td>
                    <td><span>&#8377;</span>{formData.non_prime_profit_national}</td>
                    <td><span>&#8377;</span>{formData.non_prime_average_profit}</td>

                  </tr>


                </tbody>
              </table>

            </div>
          </div>
        </div>
      }
    </div >

  );
}

export default Form;
