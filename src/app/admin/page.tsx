'use client';

import { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { Settings, Plus, Trash2, X } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  spicyLevel: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // New Dish Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [spicyLevel, setSpicyLevel] = useState('0');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) setCategoryId(data[0].id);
    } catch (err) {
      console.error('Failed to load admin menu', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isAvailable: !item.isAvailable }),
      });
      if (res.ok) fetchMenu();
    } catch (err) {
      console.error('Failed to update availability', err);
      alert('Failed to update availability');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchMenu();
    } catch (err) {
      console.error('Failed to delete item', err);
      alert('Failed to delete item');
    }
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, categoryId, image, isVeg, spicyLevel }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
        fetchMenu();
      }
    } catch (err) {
      console.error('Failed to add dish', err);
      alert('Failed to add new dish');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-16">
      <NavigationHeader />

      {/* Admin Banner */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-zinc-950 flex items-center justify-center font-black">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Admin Operations & Menu Management</h1>
              <p className="text-xs text-zinc-400">Add dishes, adjust pricing, toggle stock availability</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add New Dish
          </button>
        </div>
      </div>

      {/* Menu Categories List */}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        {loading ? (
          <div className="py-20 text-center text-zinc-500 animate-pulse">Loading Admin Menu...</div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h2 className="text-lg font-black text-amber-400">{cat.name}</h2>
                <span className="text-xs text-zinc-500 font-semibold">{cat.items.length} Dishes</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between gap-3 shadow-lg hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}
                        />
                        <h3 className="font-bold text-sm text-zinc-100">{item.name}</h3>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{item.description}</p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-extrabold text-amber-400 text-sm">₹{item.price.toFixed(0)}</span>

                        {/* Toggle Stock Badge */}
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end border-l border-zinc-800/80 pl-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-amber-400">Add New Dish to Menu</h3>

            <form onSubmit={handleCreateDish} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400">Dish Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Paneer Butter Masala"
                  className="w-full bg-zinc-950 text-xs p-2.5 rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-400">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-zinc-950 text-xs p-2.5 rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400">Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="350"
                    className="w-full bg-zinc-950 text-xs p-2.5 rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe ingredients, cooking style..."
                  rows={2}
                  className="w-full bg-zinc-950 text-xs p-2.5 rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">Photo URL (Unsplash/CDN)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 text-xs p-2.5 rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-xs font-semibold text-zinc-400">Dietary</label>
                  <select
                    value={isVeg ? 'VEG' : 'NONVEG'}
                    onChange={(e) => setIsVeg(e.target.value === 'VEG')}
                    className="w-full bg-zinc-950 text-xs p-2.5 rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="VEG">Vegetarian</option>
                    <option value="NONVEG">Non-Veg</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400">Spiciness</label>
                  <select
                    value={spicyLevel}
                    onChange={(e) => setSpicyLevel(e.target.value)}
                    className="w-full bg-zinc-950 text-xs p-2.5 rounded-xl border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="0">Not Spicy</option>
                    <option value="1">Mild</option>
                    <option value="2">Medium</option>
                    <option value="3">Hot</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
              >
                Save Dish to Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
