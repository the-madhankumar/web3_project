"use client"

import * as React from "react"
import {  ChevronsUpDown } from "lucide-react"

import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"

const frameworks =  [
    { "name": "Paracetamol  500mg" },
    { "name": "Ibuprofen  400mg" },
    { "name": "Amoxicillin  250mg" },
    { "name": "Cetirizine  10mg" },
    { "name": "Metformin  500mg" },
    { "name": "Omeprazole  20mg" },
    { "name": "Ciprofloxacin  500mg" },
    { "name": "Amlodipine  5mg" },
    { "name": "Dolo 650  650mg" },
    { "name": "Montelukast  10mg" },
    { "name": "Clopidogrel  75mg" },
    { "name": "Azithromycin  500mg" },
    { "name": "Losartan  50mg" },
    { "name": "Vitamin C  500mg" },
    { "name": "Levocetirizine  5mg" },
    { "name": "Domperidone  10mg" },
    { "name": "Esomeprazole  40mg" },
    { "name": "Dexamethasone  0.5mg" },
    { "name": "Ranitidine  150mg" },
    { "name": "Aspirin  75mg" },
    { "name": "Atorvastatin  10mg" },
    { "name": "Pantoprazole  40mg" },
    { "name": "Diclofenac  50mg" },
    { "name": "Spironolactone  25mg" },
    { "name": "Metoprolol  50mg" },
    { "name": "Furosemide  40mg" },
    { "name": "Hydrochlorothiazide  25mg" },
    { "name": "Propranolol  40mg" },
    { "name": "Captopril  25mg" },
    { "name": "Enalapril  10mg" },
    { "name": "Doxycycline  100mg" },
    { "name": "Tetracycline  500mg" },
    { "name": "Nitrofurantoin  100mg" },
    { "name": "Isoniazid  300mg" },
    { "name": "Rifampin  600mg" },
    { "name": "Ethambutol  400mg" },
    { "name": "Pyrazinamide  500mg" },
    { "name": "Clarithromycin  250mg" },
    { "name": "Erythromycin  500mg" },
    { "name": "Prednisone  5mg" },
    { "name": "Warfarin  5mg" },
    { "name": "Lisinopril  10mg" },
    { "name": "Glyburide  5mg" },
    { "name": "Gliclazide  40mg" },
    { "name": "Glimepiride  2mg" },
    { "name": "Sitagliptin  100mg" },
    { "name": "Vildagliptin  50mg" },
    { "name": "Linagliptin  5mg" },
    { "name": "Dapagliflozin  10mg" },
    { "name": "Empagliflozin  10mg" },
    { "name": "Canagliflozin  100mg" },
    { "name": "Hydroxychloroquine  200mg" },
    { "name": "Chloroquine  250mg" },
    { "name": "Tamiflu  75mg" },
    { "name": "Valacyclovir  500mg" },
    { "name": "Acyclovir  400mg" },
    { "name": "Levofloxacin  500mg" },
    { "name": "Ofloxacin  200mg" },
    { "name": "Moxifloxacin  400mg" },
    { "name": "Linezolid  600mg" },
    { "name": "Vancomycin  125mg" },
    { "name": "Daptomycin  500mg" },
    { "name": "Folic Acid  5mg" },
    { "name": "Biotin  10mg" },
    { "name": "Calcium Carbonate  500mg" },
    { "name": "Vitamin D3  1000IU" },
    { "name": "Vitamin B12  500mcg" },
    { "name": "Vitamin B6  25mg" },
    { "name": "Iron Fumarate  200mg" },
    { "name": "Cough Syrup  100ml" },
    { "name": "Paracetamol Syrup  60ml" },
    { "name": "Benadryl  100ml" },
    { "name": "Ascoril LS  100ml" },
    { "name": "Grilinctus  100ml" },
    { "name": "Corex  100ml" },
    { "name": "Broncorid  100ml" },
    { "name": "Delsym  120ml" },
    { "name": "Tixylix  100ml" },
    { "name": "Kufril LS  100ml" },
    { "name": "Phensedyl  100ml" },
    { "name": "Ambroxol Syrup  100ml" },
    { "name": "Zedex  100ml" },
    { "name": "Ventorlin  100ml" },
    { "name": "Solvin Cold  60ml" },
    { "name": "Hydryllin  100ml" },
    { "name": "TusQ D  100ml" },
    { "name": "Bromhexine  100ml" },
    { "name": "Expectorant  100ml" },
    { "name": "Liv 52  200ml" },
    { "name": "Hepamerz  200ml" },
    { "name": "Neopeptine  100ml" },
    { "name": "Zincovit  100ml" },
    { "name": "Piriton  100ml" },
    { "name": "Cital  100ml" },
    { "name": "Trisoliv  200ml" },
    { "name": "Coldmine  100ml" },
    { "name": "Ibugesic Plus  60ml" },
    { "name": "Sinarest  60ml" },
    { "name": "Rantac  100ml" },
    { "name": "Digene  200ml" },
    { "name": "Polybion  100ml" },
    { "name": "Becosules  100ml" },
    { "name": "Multivitamin  100ml" },
    { "name": "Maxtra  60ml" },
    { "name": "Colicaid  60ml" },
    { "name": "Relent  60ml" },
    { "name": "Meftal  60ml" },
    { "name": "Mezol  100ml" },
    { "name": "Loratadine  10mg" },
    { "name": "Ketorolac  10mg" },
    { "name": "Carbimazole  5mg" },
    { "name": "Methimazole  5mg" },
    { "name": "Levothyroxine  50mcg" },
    { "name": "Thiamine  100mg" },
    { "name": "Riboflavin  5mg" },
    { "name": "Pyridoxine  25mg" },
    { "name": "Cyanocobalamin  1000mcg" },
    { "name": "Pantothenic Acid  10mg" },
    { "name": "Niacinamide  50mg" },
    { "name": "Beta Carotene  10000IU" },
    { "name": "Zinc Sulphate  50mg" },
    { "name": "Magnesium Sulphate  10mg" },
    { "name": "Chromium Picolinate  200mcg" },
    { "name": "Selenium  200mcg" },
    { "name": "Manganese  2mg" },
    { "name": "Copper Gluconate  1mg" },
    { "name": "Iodine  150mcg" },
    { "name": "Potassium Chloride  20mEq" },
    { "name": "Sodium Chloride  500mg" },
    { "name": "Guaifenesin  200mg" },
    { "name": "Phenylephrine  10mg" },
    { "name": "Chlorpheniramine  4mg" },
    { "name": "Caffeine  100mg" },
    { "name": "Phenobarbitone  30mg" },
    { "name": "Sodium Valproate  500mg" },
    { "name": "Carbamazepine  200mg" },
    { "name": "Phenytoin  100mg" },
    { "name": "Lamotrigine  25mg" },
    { "name": "Levetiracetam  500mg" },
    { "name": "Topiramate  100mg" }
  ];


  export default function Tabletsearch({ onSelect }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
  
  
    const handleSelect = (tabletName) => {
      setValue(tabletName);
      onSelect(tabletName); // Notify parent component
      setOpen(false);
    };
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex w-[200px] justify-between"
          >
            {value || "Select Tablet..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No tablet found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.name}
                    onSelect={() => handleSelect(framework.name)}
                  >
                    {framework.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
  