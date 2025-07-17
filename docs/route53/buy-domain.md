---
id: buy-domain
title: Get a Personal Domain with AWS Route 53
sidebar_position: 1
tags:
  - route53
  - dns
  - domain-registration
  - beginner
last_updated: 2025-07-17
author: Tanmay Jhunjhunwala
---

> **Snapshot**  
> **🎯 Goal:** Own a custom domain (e.g. `yourname.cloud`) and point it at any AWS resource  
> **⌚ Time:** 10–15 min **💸 Cost:** US $7 – 35 / yr **🏷️ Skill level:** Beginner  
> You’ll use **Route 53 Domains** (registrar) and **Route 53** (DNS). No coding needed.

---

### What you’ll learn

- How to check domain availability with the **AWS CLI**
- The difference between *Route 53 Domains* (registrar) and *Route 53 hosted zones* (DNS)
- How to create **A / AAAA Alias** records (example: CloudFront)
- How to confirm DNS propagation with `dig` or `nslookup`

---

> **👶 First-timer?**  
> Prefer clicking? Go to **Route 53 → Registered domains → Register domain**, complete the purchase, **then jump to Step 3.3** below.  
> (CLI commands are here for copy-paste automation.)

---

## 1 Prerequisites

| Requirement | Notes |
|-------------|-------|
| AWS account with billing enabled | Domain fee charged immediately |
| IAM user/role with `route53:*` and `route53domains:*` | Attach **AmazonRoute53FullAccess** temporarily |
| AWS CLI v2 (optional) | `aws --version` → ≥ 2.16 |

> **Security tip:** Use **AWS SSO / IAM Identity Center** instead of long-lived access keys.

---

## 2 High-level flow 🗺️

```text
┌──────────────┐      ┌──────────────────┐
│ Check domain │ ───▶ │ Register &       │
│ availability │      │ verify e-mail    │
└──────────────┘      └──────┬───────────┘
                             ▼
                     ┌──────────────────┐
                     │ Create hosted    │
                     │ zone (public)    │
                     └──────┬───────────┘
                             ▼
                     ┌──────────────────┐
                     │ Add A / AAAA /   │
                     │ CNAME records    │
                     └──────┬───────────┘
                             ▼
                     ┌──────────────────┐
                     │ Test with dig /  │
                     │ browser          │
                     └──────────────────┘
```
---

## 3 Step-by-step ✅

### 3.1 Check availability

```bash
aws route53domains check-domain-availability \
  --domain-name yourname.cloud \
  --output text
# EXPECTED → AVAILABLE
```

<details>
<summary>Console path</summary>

Route 53 → **Registered domains** → **Register domain** → search “yourname.cloud”

</details>

---

### 3.2 Register the domain

1. **Create contact file**

```json
{
  "FirstName": "Tanmay",
  "LastName": "Jhunjhunwala",
  "ContactType": "PERSON",
  "Email": "you@example.com",
  "PhoneNumber": "+1.4160000000",
  "AddressLine1": "123 Queen St W",
  "City": "Toronto",
  "CountryCode": "CA",
  "ZipCode": "M5V 2A7"
}
```

2. **Run CLI**

```bash
aws route53domains register-domain \
  --domain-name yourname.cloud \
  --duration-in-years 1 \
  --admin-contact file://contact.json \
  --registrant-contact file://contact.json \
  --tech-contact file://contact.json \
  --auto-renew \
  --privacy-protect-contact-data
```

AWS emails a verification link—click **Verify** within 15 days.

> ⏱ ICANN “Add Grace Period” = 5 days to cancel & refund.

---

### 3.3 Create the hosted zone

```bash
aws route53 create-hosted-zone \
  --name yourname.cloud \
  --caller-reference "$(date +%s)"
```

Record the returned **HostedZoneId** (e.g. `Z3P5QSUBK4POTI`).

---

### 3.4 Add DNS records (CloudFront example)

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id Z3P5QSUBK4POTI \
  --change-batch '{
    "Comment": "Alias to CloudFront",
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "yourname.cloud.",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d111111abcdef8.cloudfront.net.",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

> For IPv6 repeat with `"Type": "AAAA"`.

---

### 3.5 Test resolution

```bash
dig +short yourname.cloud          # should return CloudFront IPs
whois yourname.cloud | grep Registrar
```

Visit `https://yourname.cloud` — site should load.

---

## 4 Validation & troubleshooting 🔍

| Symptom                       | Likely cause                    | Fix                                              |
| ----------------------------- | ------------------------------- | ------------------------------------------------ |
| `PENDING_VALIDATION` for days | Email not confirmed             | Resend link in **Route 53 → Registered domains** |
| `SERVFAIL` from `dig`         | Wrong NS at registrar           | Ensure NS in WHOIS match hosted-zone NS          |
| S3 site 403                   | Missing object or bucket policy | See [Static-site guide](../s3/static-site.md)    |

---

## 5 Cleanup 🧹

```bash
aws route53 delete-hosted-zone --id Z3P5QSUBK4POTI
# Optional (within 5 days)
aws route53domains delete-domain --domain-name yourname.cloud
```

---

## 6 References 📚

* AWS Docs – [Getting started with Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html)
* ICANN – [Add Grace Period](https://www.icann.org/resources/pages/agp-policy-2012-02-25-en)
