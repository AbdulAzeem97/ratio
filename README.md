# Ratio

This repository provides tools for estimating printing costs and tracking material inventory.

## Features
- **Material Cost Estimation**: Calculate total printing costs from material usage and per-unit costs.
- **Inventory Tracking**: Monitor stock levels and receive alerts when quantities fall below a threshold.

## Usage

### Inventory File
Create an `inventory.json` file describing available materials:

```json
{
  "paper": {"stock": 500, "cost": 0.05, "threshold": 100},
  "ink": {"stock": 200, "cost": 0.02, "threshold": 50}
}
```

### Estimating Job Cost
Prepare a `materials.json` file showing the amount of each material needed for a job:

```json
{
  "paper": 10,
  "ink": 5
}
```

Run the estimator:

```bash
python inventory.py estimate inventory.json materials.json --update
```

The command prints the total cost and deducts the used quantities from `inventory.json`. After updating, it also warns about any low-stock items.

### Checking Inventory Levels
To view low-stock alerts without estimating a job, run:

```bash
python inventory.py check inventory.json
```
