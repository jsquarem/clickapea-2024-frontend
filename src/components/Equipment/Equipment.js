import React from 'react';
import './Equipment.css';

// const kitchenEquipmentIcons = {
//   bowl: 'bowl',
//   pot: 'pot',
//   pan: 'pan',
//   saucepan: 'saucepan',
//   skillet: 'skillet',
//   frying_pan: 'frying_pan',
//   stockpot: 'stockpot',
//   dutch_oven: 'dutch_oven',
//   pressure_cooker: 'pressure_cooker',
//   slow_cooker: 'slow_cooker',
//   baking_sheet: 'baking_sheet',
//   cookie_sheet: 'cookie_sheet',
//   baking_dish: 'baking_dish',
//   roasting_pan: 'roasting_pan',
//   cake_pan: 'cake_pan',
//   muffin_tin: 'muffin_tin',
//   loaf_pan: 'loaf_pan',
//   springform_pan: 'springform_pan',
//   pie_dish: 'pie_dish',
//   mixing_bowl: 'mixing_bowl',
//   salad_bowl: 'salad_bowl',
//   measuring_cup: 'measuring_cup',
//   measuring_spoon: 'measuring_spoon',
//   colander: 'colander',
//   strainer: 'strainer',
//   sieve: 'sieve',
//   whisk: 'whisk',
//   spatula: 'spatula',
//   tongs: 'tongs',
//   ladle: 'ladle',
//   slotted_spoon: 'slotted_spoon',
//   wooden_spoon: 'wooden_spoon',
//   grater: 'grater',
//   zester: 'zester',
//   peeler: 'peeler',
//   garlic_press: 'garlic_press',
//   can_opener: 'can_opener',
//   bottle_opener: 'bottle_opener',
//   corkscrew: 'corkscrew',
//   cutting_board: 'cutting_board',
//   chef_knife: 'chef_knife',
//   paring_knife: 'paring_knife',
//   bread_knife: 'bread_knife',
//   carving_knife: 'carving_knife',
//   utility_knife: 'utility_knife',
//   scissors: 'scissors',
//   kitchen_shears: 'kitchen_shears',
//   rolling_pin: 'rolling_pin',
//   pastry_brush: 'pastry_brush',
//   pizza_cutter: 'pizza_cutter',
//   kitchen_timer: 'kitchen_timer',
//   food_processor: 'food_processor',
//   blender: 'blender',
//   hand_mixer: 'hand_mixer',
//   stand_mixer: 'stand_mixer',
//   microwave: 'microwave',
//   oven: 'oven',
//   stove: 'stove',
//   toaster: 'toaster',
//   toaster_oven: 'toaster_oven',
//   waffle_maker: 'waffle_maker',
//   rice_cooker: 'rice_cooker',
//   electric_kettle: 'electric_kettle',
//   coffee_maker: 'coffee_maker',
//   espresso_machine: 'espresso_machine',
//   tea_infuser: 'tea_infuser',
//   grill: 'grill',
//   griddle: 'griddle',
//   broiler: 'broiler',
//   thermometer: 'thermometer',
//   scale: 'scale',
//   mandoline: 'mandoline',
//   food_mill: 'food_mill',
//   mortar_and_pestle: 'mortar_and_pestle',
//   ricer: 'ricer',
//   salad_spinner: 'salad_spinner',
//   steamer_basket: 'steamer_basket',
//   sous_vide_machine: 'sous_vide_machine',
//   dehydrator: 'dehydrator',
//   ice_cream_maker: 'ice_cream_maker',
//   popcorn_maker: 'popcorn_maker',
//   egg_slicer: 'egg_slicer',
//   egg_timer: 'egg_timer',
// };

const Equipment = ({ equipment }) => (
  <section className="mb-6">
    <h3 className="text-xl font-semibold mb-2">Equipment</h3>
    <ul className="list-disc list-inside grid grid-cols-2 gap-4">
      {equipment.map((item, index) => (
        <li key={index} className="flex items-center">
          {item}
        </li>
      ))}
    </ul>
  </section>
);

export default Equipment;
