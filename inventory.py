import json
import argparse
import os


def load_inventory(path):
    with open(path, 'r') as f:
        return json.load(f)


def save_inventory(data, path):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)


def estimate_cost(materials, inventory):
    total = 0.0
    for name, qty in materials.items():
        item = inventory.get(name)
        if not item:
            print(f"Warning: {name} not found in inventory")
            continue
        cost = item.get('cost', 0)
        total += qty * cost
    return total


def deduct_materials(inventory, materials):
    for name, qty in materials.items():
        if name in inventory:
            inventory[name]['stock'] = inventory[name].get('stock', 0) - qty


def check_inventory(inventory):
    alerts = []
    for name, data in inventory.items():
        stock = data.get('stock', 0)
        threshold = data.get('threshold', 0)
        if stock <= threshold:
            alerts.append((name, stock))
    return alerts


def main():
    parser = argparse.ArgumentParser(description="Cost Estimation & Material Tracking")
    subparsers = parser.add_subparsers(dest="command")

    est = subparsers.add_parser("estimate", help="Estimate cost of materials used")
    est.add_argument("inventory", help="Path to inventory JSON file")
    est.add_argument("materials", help="Path to materials used JSON file")
    est.add_argument("--update", action="store_true", help="Deduct used materials from inventory and save")

    chk = subparsers.add_parser("check", help="Check inventory levels")
    chk.add_argument("inventory", help="Path to inventory JSON file")

    args = parser.parse_args()

    if args.command == "estimate":
        inventory_data = load_inventory(args.inventory)
        with open(args.materials, 'r') as f:
            materials_used = json.load(f)
        total = estimate_cost(materials_used, inventory_data)
        print(f"Total cost: ${total:.2f}")
        if args.update:
            deduct_materials(inventory_data, materials_used)
            save_inventory(inventory_data, args.inventory)
        alerts = check_inventory(inventory_data)
        for name, stock in alerts:
            print(f"Low stock alert: {name} has {stock} units left.")

    elif args.command == "check":
        inventory_data = load_inventory(args.inventory)
        alerts = check_inventory(inventory_data)
        if alerts:
            for name, stock in alerts:
                print(f"Low stock alert: {name} has {stock} units left.")
        else:
            print("All inventory levels are above thresholds.")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
